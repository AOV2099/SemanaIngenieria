<script>
  import toast from "svelte-french-toast";
  import { API_URL, availableCareers } from "../store";
  import { onMount } from "svelte";

  let events = [];

  let selectedEvent = {};

  function downloadEventsAsCsv() {
    console.log("downloading events as csv");
    const csvFileTitles =
      "Nombre, Id, Fecha, Hora de inicio, Hora de fin, Lugar, Cupo máximo, Carrera, Ponente, Maximo de asistentes\n";
    const csvFileData = events
      .map((event) => {
        return `${event.name}, ${event.id}, ${event.date}, ${event.start_time}, ${event.end_time}, ${event.location}, ${event.max_attendees}, ${event.career}, ${event.exponent}, ${event.max_attendees}\n`;
      })
      .join("");

    const csvFile = csvFileTitles + csvFileData;
    const blob = new Blob([csvFile], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "EventosSI.csv";
    document.body.appendChild(a); // Agrega el enlace al cuerpo del documento
    a.click(); // Simula un clic en el enlace para iniciar la descarga
    document.body.removeChild(a); // Elimina el enlace del cuerpo del documento
    window.URL.revokeObjectURL(url); // Limpia la URL del objeto
  }

  async function uploadEventsCsv() {
    const fileInput = document.getElementById("upload-file");
    const file = fileInput.files[0];

    if (!file) {
      toast.error("Por favor seleccione un archivo", {
        duration: 3000,
        position: "bottom-right",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
      const text = event.target.result;
      const data = parseCsv(text);
      /*for (event of data) {
       
        console.log(event);
      saveEvent(event);
      }*/

      await Promise.all(
        data.map(async (event) => {
          console.log("Event to parse: ", event);
          let newEvent = {
            name: event.Nombre,
            date: event.Fecha,
            start_time: event["Hora de inicio"],
            end_time: event["Hora de fin"],
            location: event.Lugar,
            max_attendees: event["Cupo máximo"],
            career: event.Carrera,
            exponent: event.Ponente,
            status: "Activo",
          };
          console.log("New event: ", newEvent);

          await saveEvent(newEvent);
        })
      );
    };
    reader.readAsText(file);
  }

  function parseCsv(csv) {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(",");
      if (currentline.length === headers.length) {
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].trim()] = currentline[j].trim();
        }
        result.push(obj);
      }
    }
    return result;
  }

  async function getEvents() {
    try {
      const res = await fetch(`${API_URL}/api/eventos_admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        //contar los asistentes de cada evento en la nueva propuedad ateendees_num
        data.forEach((event) => {
          event.attendees_num = event.attendees.length;
        });

        events = data;
      } else {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedEvent.imageUrl = e.target.result; // Carga la imagen como base64
      };
      reader.readAsDataURL(file);
    }
  }

  function openEventModal(event = null) {
    selectedEvent = {};

    if (event) {
      selectedEvent = Object.assign({}, event);
    }

    // Limpiar el input de archivo
    const fileInput = document.getElementById("eventImage");
    if (fileInput) {
      fileInput.value = ""; // Restablece el input de archivo
    }

    //open modal
    const modal = new bootstrap.Modal(document.getElementById("eventModal"), {
      keyboard: false,
    });

    modal.show();
  }

  async function saveEvent(eventToSave) {
    if (eventToSave) {
      selectedEvent = eventToSave;
    }
    console.log("Event to save: ", selectedEvent);

    //Check that all fields are filled
    if (
      !selectedEvent.name ||
      !selectedEvent.date ||
      !selectedEvent.start_time ||
      !selectedEvent.end_time ||
      !selectedEvent.location ||
      //!selectedEvent.description ||
      !selectedEvent.max_attendees ||
      !selectedEvent.career ||
      !selectedEvent.exponent ||
      !selectedEvent.status
    ) {
      toast.error("Por favor llena todos los campos", {
        duration: 3000,
        position: "bottom-right",
      });
      return;
    }

    if (selectedEvent.id) {
      //update event
      try {
        // console.log(selectedEvent);
        const res = await fetch(`${API_URL}/api/evento`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(selectedEvent),
        });

        //console.log(res.status);
        if (res.status === 200) {
          toast.success("Evento actualizado", {
            duration: 3000,
            position: "bottom-right",
          });
          await getEvents();
        } else {
          throw new Error("Error en la solicitud");
        }
      } catch (error) {
        //console.log("Error:", error);
        toast.error("Error al actualizar el evento", {
          duration: 3000,
          position: "bottom-right",
        });
      }
    } else {
      //add event
      try {
        const res = await fetch(`${API_URL}/api/evento`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(selectedEvent),
        });
        if (res.ok) {
          toast.success("Evento agregado", {
            duration: 3000,
            position: "bottom-right",
          });
          await getEvents();
        } else {
          throw new Error("Error en la solicitud");
        }
      } catch (error) {
        toast.error("Error al agregar el evento", {
          duration: 3000,
          position: "bottom-right",
        });
      }
    }

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("eventModal")
    );

    modal.hide();
  }

  async function deleteEvent() {
    try {
      const res = await fetch(`${API_URL}/api/evento/${selectedEvent.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (res.status === 200) {
        toast.success("Evento eliminado", {
          duration: 3000,
          position: "bottom-right",
        });
        await getEvents();
      } else {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      toast.error("Error al eliminar el evento", {
        duration: 3000,
        position: "bottom-right",
      });
    }

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("eventModal")
    );

    modal.hide();
  }

  onMount(async () => {
    await getEvents();
    document
      .getElementById("upload-btn")
      .addEventListener("click", function () {
        document.getElementById("upload-file").click(); // Abre el diálogo para seleccionar el archivo
      });

    document
      .getElementById("upload-file")
      .addEventListener("change", async function () {
        // Aquí va tu lógica para manejar el archivo seleccionado
        await uploadEventsCsv();
      });
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<nav class="navbar navbar-dark bg-dark elevated fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img
        src="https://propiedadintelectual.unam.mx/assets/img/unamblanco.png"
        alt=""
        width="30"
        height="30"
        class="d-inline-block align-text-top me-3"
      />
      Administrador de Eventos
    </a>

    <div>
      <button class="btn btn-success" id="upload-btn">
        <i class="bi bi-arrow-up-circle"></i>
        Subir CSV
      </button>
      <input
        type="file"
        id="upload-file"
        style="display: none;"
        accept=".csv"
      />

      <!--descargar csv-->
      <button
        class="btn btn-primary"
        on:click={() => {
          downloadEventsAsCsv();
        }}
      >
        <i class="bi bi-arrow-down-circle"></i>
        Descargar CSV
      </button>
    </div>
  </div>
</nav>

<br />
<br />
<br />
<br />

<div
  class="container card elevated"
  style="height: 85%; overflow:auto; overflow-x:hidden"
>
  <div class="row p-5 pb-2" style="margin-bottom: 0px;">
    <!--Info cards-->

    <!--Eventos-->
    <div class="col-3 mb-1 p-2">
      <div class="d-flex bg-primary bg-gradient rounded">
        <i class="bi bi-calendar2-week text-white ms-3" style="font-size: 3rem;"
        ></i>
        <div class="ms-4 mt-auto mb-auto">
          <h5
            class="text-white
                "
          >
            Eventos
          </h5>
          <h6
            class="text-white
                "
          >
            Total: {events.length}
          </h6>
        </div>
      </div>
    </div>

    <!--Asistentes-->
    <div class="col-3 mb-1 p-2">
      <div class="d-flex bg-success bg-gradient rounded">
        <i class="bi bi-person-check text-white ms-3" style="font-size: 3rem;"
        ></i>
        <div class="ms-4 mt-auto mb-auto">
          <h5
            class="text-white
                    "
          >
            Asistentes
          </h5>
          <h6
            class="text-white
                    "
          >
            Total: {events.reduce((acc, e) => acc + e.attendees, 0)}
          </h6>
        </div>
      </div>
    </div>

    <!--Carreras-->
    <div class="col-3 mb-1 p-2">
      <div class="d-flex bg-warning bg-gradient rounded">
        <i
          class="bi bi-book
                text-white ms-3"
          style="font-size: 3rem;"
        ></i>
        <div class="ms-4 mt-auto mb-auto">
          <h5
            class="text-white
                    "
          >
            Carreras
          </h5>
          <h6
            class="text-white
                    "
          >
            Total: {events.reduce((acc, e) => acc + 1, 0)}
          </h6>
        </div>
      </div>
    </div>
    <!--Horas disponibles (suma de horas de los eventos)-->

    <div class="col-3 mb-1 p-2">
      <div class="d-flex bg-danger bg-gradient rounded">
        <i class="bi bi-clock text-white ms-3" style="font-size: 3rem;"></i>
        <div class="ms-4 mt-auto mb-auto">
          <h5 class="text-white">Horas disponibles</h5>
          <h6 class="text-white">
            Total:{" "}
            {events.reduce((acc, e) => {
              const start = e.start_time.split(":");
              const end = e.end_time.split(":");
              const startHour = parseInt(start[0]);
              const endHour = parseInt(end[0]);
              return acc + (endHour - startHour);
            }, 0)}
          </h6>
        </div>
      </div>
    </div>
  </div>

  <div class="ps-5 pe-5">
    <hr />
    <br />
  </div>

  <div class="row p-5 pt-0">
    <!-- Add event card-->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="col-12 col-md-6 col-lg-4 col-xl-3 event-card mb-4"
      on:click={() => {
        openEventModal();
      }}
    >
      <div class="card" style="height: 100%;">
        <div class="mt-auto mb-auto">
          <div class="d-flex justify-content-center p-3">
            <i class="bi bi-plus-circle text-success" style="font-size: 6rem;"
            ></i>
          </div>
          <h5 class="card-title text-center">Agregar Evento</h5>
        </div>
      </div>
    </div>
    {#each events as event}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="col-12 col-md-6 col-lg-4 col-xl-3 event-card mb-4"
        on:click={() => {
          openEventModal(event);
        }}
      >
        <div class="card p-3" style="height: 100%;">
          <div class="d-flex justify-content-center p-2">
            <img
              src={API_URL +
                "/img/" +
                $availableCareers.find((c) => c.name == event.career).img_bg}
              class="img-thumbnail limg-fluid p-4"
              alt="..."
              style="background-color:{$availableCareers.find(
                (c) => c.name == event.career
              ).color}"
            />
          </div>
          <h5 class="card-title text-center">{event.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted text-center">
            Fecha: {event.date}
          </h6>
          <h6 class="card-subtitle mb-2 text-muted text-center">
            Lugar: {event.location}
          </h6>
          <h6 class="card-subtitle mb-2 text-muted text-center">
            Asistentes: {event.attendees_num }/{event.max_attendees}
          </h6>

          {#if event.status === "Activo"}
            <span class="badge rounded-pill bg-success">Activo</span>
          {:else}
            <span class="badge rounded-pill bg-danger">Inactivo</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Modal -->

<div
  class="modal fade"
  id="eventModal"
  tabindex="-1"
  aria-labelledby="eventModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="eventModalLabel">Evento</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <!--imagen-->

          <!--{#if selectedEvent.imageUrl}
            <div class="d-flex justify-content-center">
              <div class="image-preview mb-3">
                <img
                  src={selectedEvent.imageUrl}
                  alt="Preview"
                  class="img-thumbnail"
                />
              </div>
            </div>
          {/if}
          <div class="input-group mb-3 col-12">
            <input
              type="file"
              class="form-control"
              id="eventImage"
              accept="image/*"
              on:change={handleFileUpload}
            />
          </div>-->

          <!--Nombre del evento-->
          <div class="input-group mb-3 col-12">
            <span class="input-group-text" id="basic-addon1"
              ><i class="bi bi-book"></i></span
            >
            <input
              bind:value={selectedEvent.name}
              type="text"
              class="form-control"
              placeholder="Nombre del evento"
              aria-label="eventName"
              aria-describedby="basic-addon1"
            />
          </div>

          <!--Fecha del evento-->
          <div class="input-group mb-3 col-12">
            <span class="input-group-text" id="basic-addon1"
              ><i class="bi bi-calendar3"></i></span
            >
            <input
              bind:value={selectedEvent.date}
              type="date"
              class="form-control"
              placeholder="Fecha del evento"
              aria-label="eventDate"
              aria-describedby="basic-addon1"
            />
          </div>

          <!--Hora de inicio del evento-->
          <div class="input-group mb-3 col-6">
            <span class="input-group-text" id="basic-addon1"
              ><i class="bi bi-clock"></i></span
            >
            <input
              bind:value={selectedEvent.start_time}
              type="time"
              class="form-control"
              placeholder="Hora de inicio"
              aria-label="eventStartTime"
              aria-describedby="basic-addon1"
            />
          </div>

          <!--Hora de fin del evento-->
          <div class="input-group mb-3 col-6">
            <span class="input-group-text" id="basic-addon1"
              ><i class="bi bi-clock"></i></span
            >
            <input
              bind:value={selectedEvent.end_time}
              type="time"
              class="form-control"
              placeholder="Hora de fin"
              aria-label="eventEndTime"
              aria-describedby="basic-addon1"
            />
          </div>

          <!--Lugar del evento-->
          <div class="input-group mb-3 col-6">
            <span class="input-group-text" id="basic-addon1"
              ><i class="bi bi-geo-alt"></i></span
            >
            <input
              bind:value={selectedEvent.location}
              type="text"
              class="form-control"
              placeholder="Lugar"
              aria-label="eventLocation"
              aria-describedby="basic-addon1"
            />
          </div>

          <!--Descripción del evento (text area)-->
          <!--<div class="input-group mb-3 col-12">
            <span class="input-group-text" id="basic-addon1"
              ><i class="bi bi-card-text"></i></span
            >
            <textarea
              bind:value={selectedEvent.description}
              class="form-control"
              placeholder="Descripción"
              aria-label="eventDescription"
              aria-describedby="basic-addon1"
            ></textarea>
          </div>-->

          <!--Cupo máximo de asistentes-->
          <div class="input-group mb-3 col-6">
            <span class="input-group-text" id="basic-addon1"
              ><i class="bi bi-person"></i></span
            >
            <input
              bind:value={selectedEvent.max_attendees}
              type="number"
              class="form-control"
              placeholder="Cupo máximo"
              aria-label="eventMaxAttendees"
              aria-describedby="basic-addon1"
            />
          </div>

          <!--Carrera que imparte-->
          <div class="input-group mb-3 col-6">
            <span class="input-group-text" id="basic-addon1"
              ><i class="bi bi-book"></i></span
            >
            <!--select de availablre careers-->
            <select
              class="form-select"
              aria-label="eventCareer"
              bind:value={selectedEvent.career}
            >
              {#each $availableCareers as career, index}
                {#if index == 0}
                  <option selected>{career.name}</option>
                {:else}
                  <option>{career.name}</option>
                {/if}
              {/each}
            </select>
          </div>

          <!--Exponente del evento-->
          <div class="input-group mb-3 col-6">
            <span class="input-group-text" id="basic-addon1"
              ><i class="bi bi-person"></i></span
            >
            <input
              bind:value={selectedEvent.exponent}
              type="text"
              class="form-control"
              placeholder="Ponente"
              aria-label="eventExponent"
              aria-describedby="basic-addon1"
            />
          </div>

          <!--Estado del evento-->
          <div class="input-group mb-3 col-6">
            <span class="input-group-text" id="basic-addon1"
              ><i class="bi bi-bookmark-check"></i></span
            >
            <select
              class="form-select"
              aria-label="eventStatus"
              bind:value={selectedEvent.status}
            >
              <option selected>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer justify-content-between">
        <div>
          {#if selectedEvent.id}
            <button
              type="button"
              class="btn btn-danger"
              on:click={() => {
                deleteEvent();
              }}
            >
              Eliminar
            </button>
          {/if}
        </div>

        <button
          type="button"
          class="btn btn-primary"
          on:click={() => {
            saveEvent();
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .elevated {
    box-shadow: -4px 1px 44px 2px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: -4px 1px 44px 2px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: -4px 1px 44px 2px rgba(0, 0, 0, 0.75);
  }

  .event-card {
    border-radius: 12px;
  }

  .event-card:hover {
    transform: scale(1.1);
    transition: 0.3s;
  }

  .card-img-top {
    background-color: grey;
  }

  .input-group input[type="file"] {
    border-radius: 0.25rem;
    border: 1px dashed #ccc;
  }

  .input-group input[type="text"] {
    border-radius: 0.25rem;
    border: 1px solid #ccc;
  }

  .image-preview img {
    max-height: 200px;
    width: auto;
    object-fit: cover;
  }
</style>
