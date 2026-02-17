<script>
  import toast from "svelte-french-toast";
  import { API_URL, availableCareers } from "../store";
  import { onMount, onDestroy, tick } from "svelte";
  import { requireAdminOrRedirect } from "../auth";
  import { navigate } from "svelte-routing";

  let events = [];
  let selectedEvent = {};

  // Únicos modales (crear/editar y asistentes)
  let eventModal;
  let attendeesModal;

  // 🔎 buscador global
  let searchQuery = "";

  // Input CSV por referencia
  let csvInput;

  let token = "";
  let attendanceToggleLoading = {};

  // --- utils cookies ---
  function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }

  // --- LOGOUT ---
  async function logout() {
    try {
      // intenta cerrar sesión en el server
      const res = await fetch(`${$API_URL}/api/admin/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      // aunque el token ya no sea válido (401), limpiamos igual del lado cliente
      if (!res.ok && res.status !== 401) {
        console.warn("Logout server respondió no-ok:", res.status);
      }
    } catch (err) {
      console.warn("Error llamando a logout:", err);
    } finally {
      // limpia cliente siempre
      deleteCookie("adminToken");
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
      token = "";
      toast.success("Sesión cerrada");
      navigate("/login");
    }
  }

  // --- Bootstrap helper (1 modal) ---
  function getBS() {
    const bs = typeof window !== "undefined" ? window.bootstrap : null;
    if (!bs || !bs.Modal) {
      console.error(
        "Bootstrap Modal no está disponible (¿cargaste bootstrap.bundle.min.js?)",
      );
      toast.error(
        "No se encontró Bootstrap Modal. Carga bootstrap.bundle.min.js",
      );
      return null;
    }
    return bs;
  }

  // --- Hard reset del estado de scroll del body / backdrops --- //
  function hardResetBodyScroll() {
    const b = document.body;
    b.classList.remove("modal-open");
    b.style.removeProperty("overflow");
    b.style.removeProperty("paddingRight");
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
  }

  function getModalInstance(el) {
    const bs = getBS();
    if (!bs || !el) return null;

    const Modal = bs.Modal; // garantizado por getBS()
    // getInstance si existe, si no null
    let inst =
      typeof Modal.getInstance === "function" ? Modal.getInstance(el) : null;

    if (!inst) {
      if (typeof Modal.getOrCreateInstance === "function") {
        inst = Modal.getOrCreateInstance(el, { backdrop: true, focus: true });
      } else {
        inst = new Modal(el, { backdrop: true, focus: true });
      }
    }
    return inst;
  }

  // --- Cambiar entre modales ---
  function openAttendeesModalFor(ev = selectedEvent) {
    selectedEvent = { ...ev };
    const editInst = getModalInstance(eventModal);
    const attInst = getModalInstance(attendeesModal);
    if (editInst) {
      const onHidden = () => {
        eventModal.removeEventListener("hidden.bs.modal", onHidden);
        attInst?.show();
      };
      eventModal.addEventListener("hidden.bs.modal", onHidden, { once: true });
      editInst.hide();
    } else {
      attInst?.show();
    }
  }

  function backToEditorModal() {
    const attInst = getModalInstance(attendeesModal);
    const editInst = getModalInstance(eventModal);
    if (attInst) {
      const onHidden = () => {
        attendeesModal.removeEventListener("hidden.bs.modal", onHidden);
        editInst?.show();
      };
      attendeesModal.addEventListener("hidden.bs.modal", onHidden, {
        once: true,
      });
      attInst.hide();
    } else {
      editInst?.show();
    }
  }

  // --- CSV: abrir picker + manejar selección ---
  function triggerCsvPicker() {
    csvInput?.click();
  }

  // CSV parser simple (maneja comillas)
  function parseCsv(text) {
    function parseCsvLine(line) {
      const result = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === "," && !inQuotes) {
          result.push(current);
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current);
      return result;
    }
    const lines = text.trim().split("\n").filter(Boolean);
    if (lines.length === 0) return [];
    const headers = parseCsvLine(lines[0]).map((h) => h.trim());
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const currentline = parseCsvLine(lines[i]);
      if (currentline.length === headers.length) {
        const obj = headers.reduce((acc, header, index) => {
          acc[header] = currentline[index];
          return acc;
        }, {});
        result.push(obj);
      }
    }
    return result;
  }

  // ⚠️ IMPORT: crea cada evento con POST /api/evento (server asigna id)
  async function handleCsvSelected(e) {
    const file = e?.target?.files?.[0];
    if (!file) {
      toast.error("Primero selecciona un archivo CSV");
      return;
    }
    try {
      const text = await file.text();
      const rows = parseCsv(text);

      if (!rows.length) {
        toast.error("El CSV está vacío o no es válido");
        return;
      }

      // Mapea columnas esperadas por el server
      const payloads = rows.map((row) => ({
        name: row["Nombre"] || row["nombre"] || "",
        date: row["Fecha"] || row["fecha"] || "",
        start_time:
          row["Hora de inicio"] || row["hora_inicio"] || row["inicio"] || "",
        end_time: row["Hora de fin"] || row["hora_fin"] || row["fin"] || "",
        location: row["Lugar"] || row["lugar"] || "",
        max_attendees:
          row["Cupo máximo"] || row["cupo_maximo"] || row["cupo"] || "",
        career: row["Carrera"] || row["carrera"] || "",
        exponent: row["Ponente"] || row["ponente"] || "",
        status: (row["Estado"] || row["estado"] || "Activo").trim() || "Activo",
        attendees: [],
        visits: [],
      }));

      // Filtra los que tengan los campos mínimos
      const valid = payloads.filter(
        (ev) =>
          ev.name &&
          ev.date &&
          ev.start_time &&
          ev.end_time &&
          ev.location &&
          ev.max_attendees &&
          ev.career &&
          ev.exponent &&
          ev.status,
      );

      if (!valid.length) {
        toast.error("Ninguna fila tiene los campos requeridos.");
        return;
      }

      // POST concurrente en lotes pequeños para no saturar
      const chunk = 10;
      let created = 0,
        failed = 0;

      for (let i = 0; i < valid.length; i += chunk) {
        const slice = valid.slice(i, i + chunk);
        const results = await Promise.allSettled(
          slice.map((body) =>
            fetch(`${$API_URL}/api/evento`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(body),
            }),
          ),
        );
        results.forEach((r) => {
          if (r.status === "fulfilled" && r.value.ok) created++;
          else failed++;
        });
      }

      if (failed === 0) {
        toast.success(`Importación completa: ${created} eventos creados`);
      } else if (created > 0) {
        toast(
          (t) => `Importación parcial: ${created} creados, ${failed} con error`,
          { icon: "⚠️" },
        );
      } else {
        toast.error("No se pudo crear ningún evento");
      }

      await fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar el CSV");
    } finally {
      if (csvInput) csvInput.value = "";
    }
  }

  // --- Export CSV local ---
  function downloadEventsAsCsv() {
    const csvFileTitles =
      "Nombre, Fecha, Hora de inicio, Hora de fin, Lugar, Cupo máximo, Carrera, Ponente\n";
    const csvRows = events.map((ev) => {
      return [
        ev.name || "",
        ev.date || "",
        ev.start_time || "",
        ev.end_time || "",
        ev.location || "",
        ev.max_attendees || "",
        ev.career || "",
        ev.exponent || "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");
    });
    const csvString = csvFileTitles + csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Eventos.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // --- API eventos ---
  async function fetchEvents() {
    console.log("obteniendo eventos");

    try {
      const res = await fetch(`${$API_URL}/api/eventos_admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        data.forEach((event) => {
          if (event.is_subject) {
            if (!Array.isArray(event.suscribed)) event.suscribed = [];
            if (!event.attendance || typeof event.attendance !== "object") {
              event.attendance = {};
            }
            event.attendees_num = event.suscribed.length;
          } else {
            if (!Array.isArray(event.attendees)) event.attendees = [];
            if (!Array.isArray(event.visits)) event.visits = [];
            event.attendees_num = event.attendees.length;
          }
          if (
            !$availableCareers.find((career) => career.name === event.career)
          ) {
            event.career = $availableCareers[0]?.name || event.career;
          }
        });
        events = data;
        await tick();
        ensureCardClipping();
      } else {
        toast.error("No se pudieron obtener los eventos");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error al obtener eventos");
    }
  }

  // --- CRUD + Modal API bootstrap ---
  function openEventModal(event) {
    selectedEvent = { ...event };
    const inst = getModalInstance(eventModal);
    inst?.show();
  }

  async function saveEvent() {
    if (!selectedEvent.name || (!selectedEvent.date && !selectedEvent.is_subject )) {
      toast.error("Nombre y fecha son obligatorios");
      return;
    }
    if (selectedEvent.id) {
      try {
        const res = await fetch(`${$API_URL}/api/evento`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedEvent),
        });
        if (!res.ok) throw new Error("No se pudo actualizar el evento");
        toast.success("Evento actualizado");
        await fetchEvents();
        closeEventModal();
      } catch (e) {
        console.error(e);
        toast.error("Error al actualizar el evento");
      }
    } else {
      try {
        // El server asigna id internamente; no mandes id aquí
        const body = { ...selectedEvent };
        delete body.id;
        const res = await fetch(`${$API_URL}/api/evento`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("No se pudo crear el evento");
        toast.success("Evento creado");
        await fetchEvents();
        closeEventModal();
      } catch (e) {
        console.error(e);
        toast.error("Error al crear el evento");
      }
    }
  }

  function closeEventModal() {
    const inst = getModalInstance(eventModal);
    inst?.hide();
  }

  async function deleteEvent(ev, e) {
    e?.stopPropagation?.();
    if (!confirm(`¿Eliminar el evento "${ev.name}"?`)) return;
    try {
      const res = await fetch(`${$API_URL}/api/evento/${ev.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("No se pudo eliminar el evento");
      events = events.filter((x) => x.id !== ev.id);
      await tick();
      ensureCardClipping();
      toast.success("Evento eliminado");
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar el evento");
    }
  }

  async function toggleStatus(event, e) {
    e?.stopPropagation?.();
    try {
      const updated = {
        ...event,
        status: event.status === "Activo" ? "Inactivo" : "Activo",
      };
      const res = await fetch(`${$API_URL}/api/evento`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el estado");
      await fetchEvents();
      toast.success("Estado actualizado");
    } catch (e) {
      console.error(e);
      toast.error("Error al actualizar el estado");
    }
  }

  function startNewEvent() {
    selectedEvent = {
      // id lo pone el server al crear
      is_subject: false,
      name: "",
      date: "",
      start_time: "",
      end_time: "",
      location: "",
      max_attendees: "",
      career: $availableCareers[0]?.name || "",
      exponent: "",
      status: "Activo",
      attendees: [],
      visits: [],
      image: "",
    };
    const inst = getModalInstance(eventModal);
    inst?.show();
  }

  function removeImagePreview() {
    selectedEvent.image = "";
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      selectedEvent.image = ev.target.result;
      await tick();
      ensureCardClipping();
    };
    reader.readAsDataURL(file);
  }

  function displayDate(dateValue) {
    if (!dateValue) return "Sin fecha asignada";
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return "Sin fecha asignada";
    return dateValue;
  }

  function displayTime(timeValue) {
    const t = (timeValue || "").trim();
    if (!t) return "Sin hora asignada";
    return t;
  }

  // --- Clipping robusto ---
  let ro; // ResizeObserver
  function ensureCardClipping() {
    const cards = document.querySelectorAll(".main-card-container");
    cards.forEach((el) => {
      el.style.transform = "translateZ(0)";
      // eslint-disable-next-line no-unused-expressions
      el.offsetHeight;
      requestAnimationFrame(() => {
        el.style.transform = "translateZ(0)";
      });
      if (ro) ro.observe(el);
    });
  }

  onMount(async () => {
    const tk = await requireAdminOrRedirect($API_URL, navigate, toast);
    if (!tk) return; // ⬅️ importante: corta aquí si no hay sesión válida
    token = tk;

    // limpia estado de scroll por si quedó colgado
    hardResetBodyScroll();

    await fetchEvents();

    await tick();
    if (eventModal) {
      eventModal.addEventListener("hidden.bs.modal", hardResetBodyScroll);
      eventModal.addEventListener(
        "hidePrevented.bs.modal",
        hardResetBodyScroll,
      );
    }
    if (attendeesModal) {
      attendeesModal.addEventListener("hidden.bs.modal", hardResetBodyScroll);
      attendeesModal.addEventListener(
        "hidePrevented.bs.modal",
        hardResetBodyScroll,
      );
    }

    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => {
        document.querySelectorAll(".main-card-container").forEach((el) => {
          el.style.transform = "translateZ(0)";
          // eslint-disable-next-line no-unused-expressions
          el.offsetHeight;
        });
      });
    }

    window.addEventListener("resize", ensureCardClipping);
  });

  onDestroy(() => {
    window.removeEventListener("resize", ensureCardClipping);
    if (ro) ro.disconnect();
    // limpia cualquier resto por seguridad
    hardResetBodyScroll();
  });

  // 🔎 lista filtrada
  $: filteredEvents = events.filter((ev) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (ev.name || "").toLowerCase().includes(q) ||
      (ev.career || "").toLowerCase().includes(q) ||
      (ev.location || "").toLowerCase().includes(q) ||
      (ev.exponent || "").toLowerCase().includes(q)
    );
  });

  // --- Helpers de asistencias en materias ---
  function normalizeSubjectSuscribed(subject) {
    const list = Array.isArray(subject?.suscribed) ? subject.suscribed : [];
    return list
      .map((item) => {
        if (item && typeof item === "object") {
          return {
            id: String(item.id || "").trim(),
            name: String(item.name || "").trim() || "Sin nombre",
          };
        }
        const id = String(item || "").trim();
        return { id, name: "Sin nombre" };
      })
      .filter((x) => x.id);
  }

  function getSubjectAttendanceDates(subject) {
    const attendance =
      subject?.attendance && typeof subject.attendance === "object"
        ? subject.attendance
        : {};
    return Object.keys(attendance).sort();
  }

  function isSubjectPresentOnDate(subject, studentId, date) {
    const attendance =
      subject?.attendance && typeof subject.attendance === "object"
        ? subject.attendance
        : {};
    const ids = Array.isArray(attendance[date]) ? attendance[date] : [];
    return ids.map((x) => String(x)).includes(String(studentId));
  }

  function getSubjectAttendanceTotal(subject) {
    const dates = getSubjectAttendanceDates(subject);
    return dates.reduce((acc, date) => {
      const ids = Array.isArray(subject?.attendance?.[date])
        ? subject.attendance[date]
        : [];
      return acc + ids.length;
    }, 0);
  }

  function attendanceCellKey(studentId, date) {
    return `${String(studentId)}__${String(date)}`;
  }

  function isAttendanceCellLoading(studentId, date) {
    return !!attendanceToggleLoading[attendanceCellKey(studentId, date)];
  }

  async function toggleSubjectAttendance(studentId, date) {
    if (!selectedEvent?.id || !selectedEvent?.is_subject) return;

    const key = attendanceCellKey(studentId, date);
    attendanceToggleLoading = { ...attendanceToggleLoading, [key]: true };

    try {
      const res = await fetch(`${$API_URL}/api/evento/subject/attendance`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          user_id: String(studentId),
          date,
        }),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result?.error || "No se pudo actualizar asistencia");
      }

      const attendance =
        selectedEvent?.attendance && typeof selectedEvent.attendance === "object"
          ? { ...selectedEvent.attendance }
          : {};

      const day = Array.isArray(attendance[date])
        ? attendance[date].map((x) => String(x))
        : [];

      const uid = String(studentId);
      let nextDay = day;

      if (result.present) {
        if (!day.includes(uid)) nextDay = [...day, uid];
      } else {
        nextDay = day.filter((x) => x !== uid);
      }

      if (nextDay.length > 0) attendance[date] = nextDay;
      else delete attendance[date];

      selectedEvent = {
        ...selectedEvent,
        attendance,
      };

      toast.success(result.message || "Asistencia actualizada");
    } catch (error) {
      toast.error(error.message || "No se pudo actualizar asistencia");
    } finally {
      const next = { ...attendanceToggleLoading };
      delete next[key];
      attendanceToggleLoading = next;
    }
  }
</script>

<!-- NAVBAR PRINCIPAL -->
<nav class="navbar navbar-dark bg-dark elevated fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand d-flex align-items-center gap-2" href="#">
      <img
        src="https://propiedadintelectual.unam.mx/assets/img/unamblanco.png"
        width="30"
        height="30"
        alt="UNAM"
      />
      Administrador de Eventos
    </a>

    <div class="d-flex align-items-center gap-2 admin-toolbar">
      <div class="input-group input-group-sm admin-search-wrap">
        <span class="input-group-text bg-secondary text-white border-0"
          ><i class="bi bi-search"></i></span
        >
        <input
          class="form-control"
          type="search"
          placeholder="Buscar por nombre, carrera, sede o ponente"
          bind:value={searchQuery}
        />
      </div>
      <button
        class="btn btn-outline-info btn-sm inline-btn"
        on:click={downloadEventsAsCsv}
      >
        <i class="bi bi-download"></i><span>Exportar</span>
      </button>

      <!-- Import CSV: botón + input oculto -->
      <button
        class="btn btn-outline-primary btn-sm inline-btn"
        on:click={triggerCsvPicker}
      >
        <i class="bi bi-upload"></i><span>Importar</span>
      </button>
      <input
        type="file"
        accept=".csv,text/csv"
        class="d-none"
        bind:this={csvInput}
        on:change={handleCsvSelected}
      />

      <button
        class="btn btn-success btn-sm inline-btn"
        on:click={startNewEvent}
      >
        <i class="bi bi-plus-circle"></i><span>Nuevo Evento</span>
      </button>

      <!-- Logout -->
      <button
        class="btn btn-outline-danger btn-sm inline-btn"
        on:click={logout}
        title="Cerrar sesión"
      >
        <i class="bi bi-box-arrow-right"></i><span>Salir</span>
      </button>
    </div>
  </div>
</nav>

<div class="container admin-content">
  <!-- ✅ Una sola row, sin row anidada -->
  <div class="row">
    {#each filteredEvents as event}
      <!-- click en card = editar -->
      <div
        class="col-12 col-md-6 col-lg-4 col-xl-3 event-card mb-4"
        on:click={() => openEventModal(event)}
      >
        <div
          class="main-card-container shadow h-100"
          style="background-color: {$availableCareers.find(
            (c) => c.name == event.career,
          ).color}"
        >
          <!-- NAVBAR DE CARD: SOLO BOTONES (mac-like) -->
          <div class="card-navbar only-actions" on:click|stopPropagation>
            <div class="actions">
              <button
                class="mac-btn"
                title={event.status === "Activo" ? "Desactivar" : "Activar"}
                on:click={(e) => toggleStatus(event, e)}
              >
                <i
                  class="bi"
                  class:bi-toggle-on={event.status === "Activo"}
                  class:bi-toggle-off={event.status !== "Activo"}
                ></i>
                <span
                  >{event.status === "Activo" ? "Desactivar" : "Activar"}</span
                >
              </button>

              <!--<button
                class="mac-btn primary"
                title="Editar"
                on:click={(e) => {
                  e.stopPropagation();
                  openEventModal(event);
                }}
              >
                <i class="bi bi-pencil"></i>
              </button>-->

              <button
                class="mac-btn danger"
                title="Borrar"
                on:click={(e) => deleteEvent(event, e)}
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <!-- FONDO (sin filter para evitar bugs de clipping) -->
          <img
            src={API_URL +
              "/img/" +
              $availableCareers.find((c) => c.name == event.career).img_bg}
            class="background-image"
            alt=""
            on:load={ensureCardClipping}
          />

          <!-- CONTENIDO -->
          <div class="content">
            <div class="d-flex justify-content-between flex-wrap gap-2">
              <div class="info-box">{displayDate(event.date)}</div>
              <div class="d-flex gap-2">
                <div class="info-box">{displayTime(event.start_time)}</div>
                <div class="info-box">{displayTime(event.end_time)}</div>
              </div>
            </div>

            <div class="event-name">{event.name.toUpperCase()}</div>

            <div class="d-flex justify-content-start gap-2 flex-wrap">
              <span class="badge bg-secondary">{event.location}</span>
              <span class="badge bg-info"
                >{event.attendees_num}/{event.max_attendees}</span
              >
              {#if event.status === "Activo"}
                <span class="badge bg-success">Activo</span>
              {:else}
                <span class="badge bg-danger">Inactivo</span>
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- MODAL: CREAR/EDITAR (único modal) -->
<div
  class="modal fade"
  id="eventModal"
  tabindex="-1"
  aria-labelledby="eventModalLabel"
  aria-hidden="true"
  bind:this={eventModal}
>
  <div
    class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
  >
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="eventModalLabel">
          {selectedEvent?.id ? "Editar evento" : "Crear evento"}
        </h5>

        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          on:click={closeEventModal}
        ></button>
      </div>
      <div class="modal-body">
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label">Es materia </label>
            <!--checkbox-->
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="isMateriaSwitch"
                bind:checked={selectedEvent.is_subject}
                disabled={!!selectedEvent.id}
              />
              <label class="form-check-label" for="isMateriaSwitch">
                {selectedEvent.is_subject ? "Sí" : "No"}
              </label>
            </div>
            {#if selectedEvent.id}
              <small class="text-muted">
                El tipo de evento solo se puede definir al crear.
              </small>
            {/if}
          </div>

          <div class="col-12">
            <label class="form-label">Nombre del evento</label>
            <div class="input-group">
              <span class="input-group-text"
                ><i class="bi bi-card-heading"></i></span
              >
              <input
                bind:value={selectedEvent.name}
                type="text"
                class="form-control"
                placeholder="Nombre del evento"
              />
            </div>
          </div>
          <!-- ocultar en caso de ser materia -->

          {#if !selectedEvent.is_subject}
            <div class="col-md-6">
              <label class="form-label">Fecha</label>
              <div class="input-group">
                <span class="input-group-text"
                  ><i class="bi bi-calendar-event"></i></span
                >
                <input
                  bind:value={selectedEvent.date}
                  type="date"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Hora de inicio</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-clock"></i></span
                >
                <input
                  bind:value={selectedEvent.start_time}
                  type="time"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Hora de fin</label>
              <div class="input-group">
                <span class="input-group-text"
                  ><i class="bi bi-clock-history"></i></span
                >
                <input
                  bind:value={selectedEvent.end_time}
                  type="time"
                  class="form-control"
                />
              </div>
            </div>
          {/if}
          <div class="col-md-6">
            <label class="form-label">Lugar</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-geo-alt"></i></span
              >
              <input
                bind:value={selectedEvent.location}
                type="text"
                class="form-control"
                placeholder="Lugar"
              />
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Cupo máximo</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person"></i></span>
              <input
                bind:value={selectedEvent.max_attendees}
                type="number"
                min="0"
                class="form-control"
                placeholder="Cupo máximo"
              />
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Carrera</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-book"></i></span>
              <select class="form-select" bind:value={selectedEvent.career}>
                {#each $availableCareers as career}
                  <option>{career.name}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Ponente</label>
            <div class="input-group">
              <span class="input-group-text"
                ><i class="bi bi-megaphone"></i></span
              >
              <input
                bind:value={selectedEvent.exponent}
                type="text"
                class="form-control"
                placeholder="Ponente"
              />
            </div>
          </div>

          {#if selectedEvent.image}
            <div class="col-12">
              <div class="image-preview mb-2">
                <img
                  src={selectedEvent.image}
                  alt="Preview"
                  class="img-thumbnail"
                />
              </div>
              <button
                class="btn btn-outline-danger btn-sm inline-btn"
                on:click={removeImagePreview}
              >
                <i class="bi bi-x-circle"></i><span>Quitar imagen</span>
              </button>
            </div>
          {/if}
          <!--<div class="col-12">
            <label class="form-label">Imagen (opcional)</label>
            <input
              type="file"
              class="form-control"
              id="eventImage"
              accept="image/*"
              on:change={handleFileUpload}
            /> 
          </div>-->
        </div>
      </div>
      <div class="modal-footer">
        {#if selectedEvent.id}
          <div class="justify-content-between w-100 d-flex">
            <div>
              <button
                type="button"
                class="btn btn-outline-primary me-2"
                on:click={() => openAttendeesModalFor(selectedEvent)}
                title="Ver inscritos y asistencias"
              >
                <i class="bi bi-people-check"></i> Asistencias
              </button>
            </div>

            <div>
              <button class="btn btn-primary inline-btn" on:click={saveEvent}>
                <i class="bi bi-save"></i><span>Guardar cambios</span>
              </button>
              <button
                class="btn btn-secondary inline-btn"
                on:click={closeEventModal}
              >
                <i class="bi bi-x-circle"></i><span>Cerrar</span>
              </button>
            </div>
          </div>
        {:else}
          <button class="btn btn-success inline-btn" on:click={saveEvent}>
            <i class="bi bi-check2-circle"></i><span>Crear</span>
          </button>
          <button
            class="btn btn-secondary inline-btn"
            on:click={closeEventModal}
          >
            <i class="bi bi-x-circle"></i><span>Cancelar</span>
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- MODAL: INSCRITOS / ASISTENCIAS -->
<div
  class="modal fade"
  id="attendeesModal"
  tabindex="-1"
  aria-labelledby="attendeesModalLabel"
  aria-hidden="true"
  bind:this={attendeesModal}
>
  <div
    class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
  >
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="attendeesModalLabel">
          Inscritos — {selectedEvent?.name || "Evento"}
        </h5>
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-info">
            {selectedEvent?.is_subject
              ? normalizeSubjectSuscribed(selectedEvent).length
              : selectedEvent?.attendees?.length || 0}
            inscritos
          </span>
          <span class="badge bg-success">
            {selectedEvent?.is_subject
              ? getSubjectAttendanceTotal(selectedEvent)
              : selectedEvent?.visits?.length || 0}
            asistencias
          </span>

          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            on:click={() => getModalInstance(attendeesModal)?.hide()}
          ></button>
        </div>
      </div>

      <div class="modal-body">
        {#if selectedEvent?.is_subject}
          {@const subjectRows = normalizeSubjectSuscribed(selectedEvent)}
          {@const subjectDates = getSubjectAttendanceDates(selectedEvent)}

          {#if subjectRows.length > 0}
            <div class="table-responsive small">
              <table class="table table-sm table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style="width:56px;">#</th>
                    <th style="min-width: 220px;">Alumno</th>
                    {#if subjectDates.length > 0}
                      {#each subjectDates as dt}
                        <th class="text-center" style="min-width: 130px;">{dt}</th>
                      {/each}
                    {:else}
                      <th class="text-muted">Sin días con asistencias aún</th>
                    {/if}
                  </tr>
                </thead>
                <tbody>
                  {#each subjectRows as student, i}
                    <tr>
                      <td class="text-muted">{i + 1}</td>
                      <td>
                        <div class="fw-semibold">{student.name}</div>
                        <code>{student.id}</code>
                      </td>

                      {#if subjectDates.length > 0}
                        {#each subjectDates as dt}
                          <td class="text-center">
                            {#if isAttendanceCellLoading(student.id, dt)}
                              <button class="btn btn-sm btn-outline-secondary" disabled>
                                Actualizando...
                              </button>
                            {:else}
                              <button
                                class="btn btn-sm attendance-toggle-btn"
                                class:btn-success={isSubjectPresentOnDate(
                                  selectedEvent,
                                  student.id,
                                  dt,
                                )}
                                class:btn-outline-secondary={!isSubjectPresentOnDate(
                                  selectedEvent,
                                  student.id,
                                  dt,
                                )}
                                on:click={() =>
                                  toggleSubjectAttendance(student.id, dt)}
                                title="Marcar / desmarcar asistencia"
                              >
                                {#if isSubjectPresentOnDate(selectedEvent, student.id, dt)}
                                  <i class="bi bi-check2-circle"></i> Asistió
                                {:else}
                                  <i class="bi bi-dash-circle"></i> Pendiente
                                {/if}
                              </button>
                            {/if}
                          </td>
                        {/each}
                      {:else}
                        <td class="text-muted">Sin registros</td>
                      {/if}
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {:else}
            <div class="text-muted">Aún no hay alumnos en suscribed.</div>
          {/if}
        {:else if selectedEvent?.attendees && selectedEvent.attendees.length > 0}
          <div class="table-responsive small">
            <table class="table table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th style="width:56px;">#</th>
                  <th>Número de cuenta / ID</th>
                  <th style="width:160px;">Asistencia</th>
                </tr>
              </thead>
              <tbody>
                {#each selectedEvent.attendees as acc, i}
                  <tr>
                    <td class="text-muted">{i + 1}</td>
                    <td><code>{acc}</code></td>
                    <td>
                      {#if selectedEvent?.visits && selectedEvent.visits.includes(acc)}
                        <span
                          class="badge bg-success d-inline-flex align-items-center gap-1"
                        >
                          <i class="bi bi-check2-circle"></i> Asistió
                        </span>
                      {:else}
                        <span
                          class="badge bg-secondary d-inline-flex align-items-center gap-1"
                        >
                          <i class="bi bi-clock"></i> Pendiente
                        </span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {:else}
          <div class="text-muted">Aún no hay inscritos.</div>
        {/if}
      </div>

      <div class="modal-footer">
        <button
          class="btn btn-secondary inline-btn"
          on:click={backToEditorModal}
        >
          <i class="bi bi-arrow-left"></i><span>Volver a edición</span>
        </button>
        <button
          class="btn btn-outline-dark inline-btn"
          on:click={() => getModalInstance(attendeesModal)?.hide()}
        >
          <i class="bi bi-x-circle"></i><span>Cerrar</span>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .elevated {
    box-shadow: -4px 1px 44px 2px rgba(0, 0, 0, 0.75);
  }

  .event-card {
    border-radius: 12px;
  }

  .admin-content {
    margin-top: 92px;
  }

  .admin-toolbar {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .admin-search-wrap {
    min-width: 260px;
  }

  .main-card-container {
    border-radius: 12px;
    padding: 18px 18px 16px;
    position: relative;
    min-height: 230px;

    /* 🛡️ Clipping robusto */
    overflow: hidden;
    clip-path: inset(0 round 12px);
    /* Safari/iOS: respeta el recorte con imágenes y composición */
    -webkit-mask-image: -webkit-radial-gradient(white, black);

    isolation: isolate;
    contain: paint;
    transform: translateZ(0); /* capa propia estable (evita glitches) */
    will-change: transform;
  }

  /* --- NAVBAR PRINCIPAL: icono + texto en línea --- */
  .navbar .btn.inline-btn,
  .navbar label.btn.inline-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
  }

  @media (max-width: 992px) {
    :global(.navbar.fixed-top .container-fluid) {
      row-gap: 0.5rem;
      align-items: flex-start;
    }

    .admin-toolbar {
      width: 100%;
      justify-content: flex-start;
    }

    .admin-search-wrap {
      width: 100%;
      min-width: 0;
      order: 1;
    }

    .admin-toolbar .inline-btn {
      order: 2;
      flex: 1 1 auto;
      justify-content: center;
    }

    .admin-content {
      margin-top: 150px;
    }
  }

  @media (max-width: 576px) {
    .navbar-brand {
      font-size: 0.95rem;
    }

    .navbar-brand img {
      width: 24px;
      height: 24px;
    }

    .admin-toolbar .inline-btn {
      flex: 1 1 calc(50% - 0.4rem);
      min-height: 36px;
    }

    .admin-content {
      margin-top: 170px;
    }
  }

  /* Evita "salto" de navbar fija cuando body recibe padding-right */
  :global(.modal-open .fixed-top) {
    padding-right: 0 !important;
  }

  /* --- NAVBAR CARD: SOLO ACCIONES (mac-like) --- */
  .card-navbar.only-actions {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 42px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    color: white;
    z-index: 2;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.65),
      rgba(0, 0, 0, 0.25)
    );
    backdrop-filter: blur(6px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .card-navbar .actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  /* Botón estilo mac */
  .mac-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0.08)
    );
    border: 1px solid rgba(255, 255, 255, 0.22);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.25),
      0 1px 2px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(4px);
    white-space: nowrap;
  }
  .mac-btn:hover {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.26),
      rgba(255, 255, 255, 0.14)
    );
  }
  .mac-btn:active {
    transform: translateY(1px);
  }
  .mac-btn.danger {
    border-color: rgba(255, 99, 99, 0.45);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 1px 2px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 80, 80, 0.35) inset;
  }

  .background-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.2;
    pointer-events: none;
    user-select: none;
  }

  .content {
    position: relative;
    z-index: 1;
    margin-top: 52px;
  }

  .event-name {
    color: white;
    font-size: 18pt;
    font-weight: 700;
    margin: 8px 0 12px 0;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  }

  .info-box {
    background: rgba(0, 0, 0, 0.35);
    color: white;
    padding: 4px 10px;
    border-radius: 999px; /* pill */
    font-weight: 600;
    backdrop-filter: blur(2px);
    white-space: nowrap;
  }

  .image-preview {
    display: inline-block;
    margin: 0;
    padding: 8px;
    border-radius: 0.25rem;
    border: 1px dashed #ccc;
  }
  .image-preview img {
    max-height: 200px;
    width: auto;
    object-fit: cover;
  }

  .badge {
    margin-right: 6px;
    margin-bottom: 6px;
  }

  .mac-btn.primary {
    border-color: rgba(13, 110, 253, 0.55); /* azul bootstrap */
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 1px 2px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(13, 110, 253, 0.35) inset;
  }
  .mac-btn.primary:hover {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.24),
      rgba(255, 255, 255, 0.12)
    );
  }

  /* toquecito para los IDs en la tabla */
  .table code {
    background: rgba(0, 0, 0, 0.04);
    padding: 0.15rem 0.35rem;
    border-radius: 0.25rem;
  }

  .attendance-toggle-btn {
    min-width: 110px;
  }
</style>
