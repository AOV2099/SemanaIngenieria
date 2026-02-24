// server.js — Semana Ingeniería (corregido)
const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");
const cors = require("cors");
const { Parser } = require("json2csv");
const moment = require("moment");
const { connectRedis, getRedisClient } = require("./redisClient");
const { v4: uuidv4 } = require("uuid");

// ---- Config ----
const APP_PORT = process.env.APP_PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const APP_MODE = process.env.APP_MODE || "0";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "password";

// Wallet links opcionales (usar {{ACCOUNT_ID}} como placeholder)
const APPLE_WALLET_PASS_URL_TEMPLATE =
  process.env.APPLE_WALLET_PASS_URL_TEMPLATE || "";
const GOOGLE_WALLET_SAVE_URL_TEMPLATE =
  process.env.GOOGLE_WALLET_SAVE_URL_TEMPLATE || "";

console.log("APP MODE", APP_MODE);
console.log("APP PORT", APP_PORT);
console.log("REDIS URL", REDIS_URL);

// ---- Constantes de claves ----
const KEY_EVENTS = "si:eventos";
const KEY_ATTENDEES = "si:alumnos";
const KEY_ADMIN_TOKENS = "si:tokens";
const KEY_MATERIAS = "si:materias";
const KEY_PROFESORES = "si:profesores";
const ADMIN_TOKEN_TTL_SECONDS = 8 * 60 * 60; // 8 horas = 28800 segundos

// ---- App ----
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);

let redisClient;

// --- Crear admin token (con expiración automática) ---
async function createAdminToken(meta = {}) {
  const token = uuidv4();
  const key = KEY_ADMIN_TOKENS + token;
  const payload = {
    createdAt: Date.now(),
    ...meta,
  };
  try {
    await redisClient.set(key, JSON.stringify(payload), {
      EX: ADMIN_TOKEN_TTL_SECONDS,
      NX: true,
    });
    console.log("Admin token creado:", token);
    return {
      token,
      expiresIn: ADMIN_TOKEN_TTL_SECONDS,
      expiresAt: Date.now() + ADMIN_TOKEN_TTL_SECONDS * 1000,
    };
  } catch (error) {
    console.error("Error creando admin token:", error);
    return null;
  }
}

// --- Verificar admin token ---
async function checkAdminToken(token) {
  if (!token) return false;
  const key = KEY_ADMIN_TOKENS + token;
  const val = await redisClient.get(key);
  return !!val;
}

// --- Invalidar admin token (antes de que caduque solo) ---
async function invalidateAdminToken(token) {
  if (!token) return false;
  const key = KEY_ADMIN_TOKENS + token;
  await redisClient.del(key);
  console.log("Admin token invalidado:", token);
  return true;
}

// --- Middleware: requiere token admin válido ---
async function requireAdmin(req, res, next) {
  try {
    const auth = req.headers["authorization"] || "";
    const token = auth.startsWith("Bearer ")
      ? auth.slice(7).trim()
      : auth.trim();
    const ok = await checkAdminToken(token);
    if (!ok) return res.status(401).json({ error: "Unauthorized" });
    // opcional: req.admin = { token }
    next();
  } catch (error) {
    res.status(500).json({ error: "Auth error" });
  }
}

// ---- Bootstrap de datos ----
async function verifyRedisKeys() {
  try {
    const eventsExists = await redisClient.exists(KEY_EVENTS);
    const attendeesExists = await redisClient.exists(KEY_ATTENDEES);
    const materiasExists = await redisClient.exists(KEY_MATERIAS);
    const profesoresExists = await redisClient.exists(KEY_PROFESORES);

    if (eventsExists && attendeesExists && materiasExists) {
      console.log("Las claves existen.");
      return;
    }

    console.log("No se encontraron todas las claves requeridas, creando...");
    const testEvent = {
      id: uuidv4(),
      name: "La Oportunidad ante la Adversidad, desarrolla sin miedos tus habilidades en administración (sin usar TikTok)",
      date: "2024-09-12",
      start_time: "16:00:00",
      end_time: "17:00:00",
      location: "Auditorio del Centro Tecnológico Aragón",
      max_attendees: "200", // puede venir como string desde el seed
      career: "Ingeniería en Computación",
      exponent: "Ing. Juan Carlos",
      status: "Activo",
      attendees: [],
      visits: [],
    };

    //crear clave de eventos con un evento de prueba para evitar errores en la app
    await redisClient.json.set(KEY_EVENTS, "$", [testEvent]);
    console.log("Clave de eventos creada con un evento de prueba.");

    //crear clave de asistentes vacía
    await redisClient.hSet(
      KEY_ATTENDEES,
      "init",
      JSON.stringify({ events: [] }),
    );

    //crear clave de materias vacía (hset con campo dummy para evitar que se borre la clave)
    await redisClient.hSet(
      KEY_MATERIAS,
      "init",
      JSON.stringify({
        name: "Materia de prueba",
        code: "init",
        semester: "2026-1",
        career: "Ingeniería en Computación",
        attendance: {
          "1999-01-01": [420124928],
        },
      }),
    );

    //crear clave de profesores vacía (hset con campo dummy para evitar que se borre la clave)
    await redisClient.hSet({
      KEY_PROFESORES,
      init123: JSON.stringify({
        name: "Profesor de prueba",
        rfc: "init123",
        email: "test@aragon.unam.mx",
        phone: "5555555555",
        career: "Ingeniería en Computación",
        subjects: ["init"], //usar clave de materia
        password: "password",
      }),
    });
  } catch (error) {
    console.error("Error al verificar claves.", error);
  }
}

// ---- Utilidades ----
function isJsonEventCorrect(event) {
  console.log("EVENTO:", event);

  if (!event.name) return false;
  if (!event.is_subject) {
    // Si no es un evento de materia, se requieren start_time, end_time y date. Si es de materia, no se requieren esos campos porque cada fecha de asistencia puede tener horarios distintos.
    if (!event.date) return false;
    if (!event.start_time) return false;
    if (!event.end_time) return false;
  }
  if (!event.location) return false;
  if (!event.max_attendees) return false;
  // Para materias, carrera puede omitirse por ahora (se normaliza a "default").
  if (!event.is_subject && !event.career) return false;
  if (!event.exponent) return false;
  if (!event.status) return false;

  console.log("EVENTO CORRECTO");

  return true;
}

function isActiveStatus(status) {
  return (status || "").trim().toLowerCase() === "activo";
}

// ---- HTTPS (certs de mkcert) ----
let cert, key;
try {
  cert = fs.readFileSync("./localhost.pem", "utf8");
  key = fs.readFileSync("./localhost-key.pem", "utf8");
  console.log("Cert y key leídos correctamente.");
} catch (error) {
  console.error("No fue posible leer cert o key:", error);
}
const httpsOptions = { key, cert };

// ---- Assets Svelte ----
app.get("/build/bundle.css", (req, res) => {
  res.sendFile(path.join(__dirname, "svelte", "public", "build", "bundle.css"));
});
app.get("/build/bundle.js", (req, res) => {
  res.sendFile(path.join(__dirname, "svelte", "public", "build", "bundle.js"));
});
app.get("/global.css", (req, res) => {
  res.sendFile(path.join(__dirname, "svelte", "public", "global.css"));
});
app.get("/img/:imgid", (req, res) => {
  res.sendFile(
    path.join(__dirname, "svelte", "public", "img", `${req.params.imgid}`),
  );
});
app.get("/build/qr-scanner-worker.min*.js", (req, res) => {
  const fileName = req.path.split("/").pop();
  res.sendFile(path.join(__dirname, "svelte", "public", "build", fileName));
});

// ---- API de eventos ----

//Ping de salud
app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

// Enlaces para guardar credencial en wallets (si están configurados por env)
app.get("/api/wallet/links/:accountId", (req, res) => {
  const accountId = String(req.params.accountId || "").trim();
  if (!accountId) {
    return res.status(400).json({ error: "accountId requerido" });
  }

  const replaceAccountId = (tpl) =>
    String(tpl || "").replaceAll("{{ACCOUNT_ID}}", encodeURIComponent(accountId));

  const appleWalletUrl = APPLE_WALLET_PASS_URL_TEMPLATE
    ? replaceAccountId(APPLE_WALLET_PASS_URL_TEMPLATE)
    : null;
  const googleWalletUrl = GOOGLE_WALLET_SAVE_URL_TEMPLATE
    ? replaceAccountId(GOOGLE_WALLET_SAVE_URL_TEMPLATE)
    : null;

  return res.status(200).json({
    ok: true,
    accountId,
    appleWalletUrl,
    googleWalletUrl,
    configured: {
      apple: Boolean(APPLE_WALLET_PASS_URL_TEMPLATE),
      google: Boolean(GOOGLE_WALLET_SAVE_URL_TEMPLATE),
    },
  });
});

// Públicos (solo Activo) — no muta arrays internos; expone attendees como count
app.get("/api/eventos", async (req, res) => {
  console.log("/api/eventos");
  
  try {
    const eventos = (await redisClient.json.get(KEY_EVENTS)) || [];
    const materias = await redisClient.hGetAll(KEY_MATERIAS) || {};
    const allowedEvents = eventos
      .filter((e) => isActiveStatus(e.status))
      .map((e) => ({
        ...e,
        attendees: Array.isArray(e.attendees) ? e.attendees.length : 0,
      }));

      // Agregar materias al listado de eventos, transformando su formato
    for (const [id, matStr] of Object.entries(materias)) {
      if (id === "init") continue; // saltar campo dummy
      try {
        const mat = JSON.parse(matStr);
        const attendeesList = Array.isArray(mat.attendees)
          ? mat.attendees.map((x) => String(x))
          : Array.isArray(mat.suscribed)
            ? mat.suscribed.map((s) =>
                typeof s === "object" && s !== null
                  ? String(s.id || "")
                  : String(s),
              ).filter(Boolean)
            : [];
        allowedEvents.push({
          id,
          name: mat.name,
          date: "", // las materias no tienen fecha fija, así que se deja vacío
          start_time: "",
          end_time: "",
          location: mat.location || "N/A",
          max_attendees: mat.max_attendees || "N/A",
          career: mat.career,
          exponent: mat.exponent || "N/A",
          status: mat.status || "Activo",
          attendees: attendeesList.length,
          is_subject: true, // marcar que es un evento de materia
        });
      } catch (error) {
        console.error("Error al parsear materia:", error);
      }
    }
    console.log("Devolviendo", allowedEvents.length, "eventos");
    

    res.status(200).json(allowedEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin (sin filtro)
app.get("/api/eventos_admin", requireAdmin, async (req, res) => {
  try {
    const eventos = (await redisClient.json.get(KEY_EVENTS)) || [];
    const materias = await redisClient.hGetAll(KEY_MATERIAS) || {};

    // Agregar materias al listado de eventos, transformando su formato
    for (const [id, matStr] of Object.entries(materias)) {
      if (id === "init") continue; // saltar campo dummy
      try {
        const mat = JSON.parse(matStr);
        const attendeesList = Array.isArray(mat.attendees)
          ? mat.attendees.map((x) => String(x))
          : Array.isArray(mat.suscribed)
            ? mat.suscribed.map((s) =>
                typeof s === "object" && s !== null
                  ? String(s.id || "")
                  : String(s),
              ).filter(Boolean)
            : [];
        eventos.push({
          id,
          name: mat.name,
          date: "", // las materias no tienen fecha fija, así que se deja vacío
          start_time: "",
          end_time: "",
          location: mat.location || "N/A",
          max_attendees: mat.max_attendees || "N/A",
          career: mat.career,
          exponent: mat.exponent || "N/A",
          status: mat.status || "Activo",
          attendees: attendeesList,
          attendance: mat.attendance && typeof mat.attendance === "object"
            ? mat.attendance
            : {},
          image: mat.image || "",
          is_subject: true, // marcar que es un evento de materia
        });
      } catch (error) {
        console.error("Error al parsear materia:", error);
      }
    }

    eventos.forEach((ev) => {
      if (!ev.is_subject) {
        if (!Array.isArray(ev.attendees)) ev.attendees = [];
        if (!Array.isArray(ev.visits)) ev.visits = [];
      }
    });
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Crear evento
app.post("/api/evento", requireAdmin, async (req, res) => {
  const evento = req.body;
  try {
    //revisar si el body contiene "is_subject"
    const isSubject = req.body && req.body.is_subject;

    if (isSubject && !evento.career) {
      evento.career = "default";
    }

    if (!isJsonEventCorrect(evento)) {
      console.log("EVENTO INCORRECTAMENTE CONSTRUIDO");

      return res.status(400).json({ error: "Cuerpo de evento inválido" });
    }
    evento.id = uuidv4();

    if (!isSubject) {
      if (!Array.isArray(evento.attendees)) evento.attendees = [];
      if (!Array.isArray(evento.visits)) evento.visits = [];
      const exists = await redisClient.exists(KEY_EVENTS);
      if (!exists) {
        await redisClient.json.set(KEY_EVENTS, "$", [evento]);
      } else {
        await redisClient.json.arrAppend(KEY_EVENTS, "$", evento);
      }
      res.status(200).send("Evento agregado correctamente");
    } else {
      console.log("Creando materia...");

      // Materia: usar attendees/attendance, sin visits/suscribed
      if (!Array.isArray(evento.attendees)) evento.attendees = [];
      if (!evento.attendance || typeof evento.attendance !== "object") {
        evento.attendance = {};
      }
      delete evento.suscribed;
      delete evento.visits;

      // al ser evento, usar KEY_MATERIAS
      await redisClient.hSet(
        KEY_MATERIAS,
        evento.id, // TODO: Obtener codigo unico desde el body o generar uno decente
        JSON.stringify(evento),
      );
      res.status(200).send("Materia agregada correctamente");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar evento (merge)
app.put("/api/evento", requireAdmin, async (req, res) => {
  const evento = req.body || {};
  try {
    if (!evento.id) {
      return res.status(400).json({ error: "ID de evento requerido" });
    }

    const eventos = (await redisClient.json.get(KEY_EVENTS)) || [];
    const index = eventos.findIndex((e) => e.id === evento.id);

    let source = "events";
    let current = index >= 0 ? eventos[index] : null;

    if (!current) {
      const materiaStr = await redisClient.hGet(KEY_MATERIAS, evento.id);
      if (materiaStr) {
        current = JSON.parse(materiaStr);
        source = "subjects";
      }
    }

    if (!current) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    const currentIsSubject = Boolean(current.is_subject);
    const requestedIsSubject =
      evento.is_subject === undefined
        ? currentIsSubject
        : Boolean(evento.is_subject);

    // El tipo de evento NO se puede modificar después de creado
    if (requestedIsSubject !== currentIsSubject) {
      return res.status(400).json({
        error:
          "No se puede cambiar el tipo de evento. is_subject solo se define al crear.",
      });
    }

    const merged = {
      ...current,
      ...evento,
      id: current.id,
      is_subject: currentIsSubject,
    };

    if (!isJsonEventCorrect(merged)) {
      return res.status(400).json({ error: "Cuerpo de evento inválido" });
    }

    if (currentIsSubject) {
      if (!merged.career) {
        merged.career = "default";
      }
      if (!Array.isArray(merged.attendees)) {
        merged.attendees = Array.isArray(current.attendees)
          ? current.attendees
          : Array.isArray(current.suscribed)
            ? current.suscribed.map((s) =>
                typeof s === "object" && s !== null
                  ? String(s.id || "")
                  : String(s),
              ).filter(Boolean)
          : [];
      }
      if (!merged.attendance || typeof merged.attendance !== "object") {
        merged.attendance =
          current.attendance && typeof current.attendance === "object"
            ? current.attendance
            : {};
      }
          delete merged.suscribed;
      delete merged.visits;
      await redisClient.hSet(KEY_MATERIAS, merged.id, JSON.stringify(merged));
    } else {
      if (!Array.isArray(merged.attendees)) {
        merged.attendees = Array.isArray(current.attendees)
          ? current.attendees
          : [];
      }
      if (!Array.isArray(merged.visits)) {
        merged.visits = Array.isArray(current.visits) ? current.visits : [];
      }

      eventos[index] = merged;
      await redisClient.json.set(KEY_EVENTS, "$", eventos);
    }

    res.status(200).send("Evento actualizado correctamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar evento
app.delete("/api/evento/:id", requireAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const eventos = (await redisClient.json.get(KEY_EVENTS)) || [];
    const index = eventos.findIndex((e) => e.id === id);

    // 1) Intentar borrar evento regular
    if (index !== -1) {
      eventos.splice(index, 1);
      await redisClient.json.set(KEY_EVENTS, "$", eventos);
      return res.status(200).send("Evento eliminado correctamente");
    }

    // 2) Si no existe en eventos, intentar borrar materia
    const deletedSubjectCount = await redisClient.hDel(KEY_MATERIAS, id);
    if (deletedSubjectCount > 0) {
      return res.status(200).send("Materia eliminada correctamente");
    }

    return res.status(404).json({ error: "Evento no encontrado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Construye un momento con fecha y hora, validando ambos formatos HH:mm y HH:mm:ss.
function makeDateTime(dateStr, timeStr) {
  // intenta con segundos y sin segundos
  let m = moment(`${dateStr} ${timeStr}`, "YYYY-MM-DD HH:mm:ss", true);
  if (!m.isValid())
    m = moment(`${dateStr} ${timeStr}`, "YYYY-MM-DD HH:mm", true);
  return m;
}

// Regla de traslape: [startA, endA) con [startB, endB)
// Hay traslape si startA < endB y endA > startB
function intervalsOverlap(startA, endA, startB, endB) {
  return startA.isBefore(endB) && endA.isAfter(startB);
}

// ---- Inscripción / Desinscripción (nuevas rutas limpias) ----
const MAX_ALLOWED_EVENTS = 5;

async function handlerSubscribe(req, res) {
  const idEvento = req.body.event_id;
  const idAsistente = req.body.user_id;
  const isSubject = req.body.is_subject || false;
  try {
    await redisClient.watch(KEY_EVENTS, KEY_MATERIAS);

    const eventos = (await redisClient.json.get(KEY_EVENTS)) || [];
    let index = eventos.findIndex((e) => e.id === idEvento);
    let evento = index >= 0 ? eventos[index] : null;
    let source = "events";

    // Si no se encuentra en eventos regulares, buscar en materias
    if (!evento) {
      const materiaStr = await redisClient.hGet(KEY_MATERIAS, idEvento);
      if (materiaStr) {
        evento = JSON.parse(materiaStr);
        source = "subjects";
      }
    }

    if (!evento) {
      await redisClient.unwatch();
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    const isSubjectEvent = Boolean(evento.is_subject || isSubject);

    if (isSubjectEvent) {
      await redisClient.unwatch();
      return res.status(403).json({
        error:
          "Las materias no permiten autoinscripción. Admin debe cargar la lista suscribed.",
      });
    }

    if (!Array.isArray(evento.attendees)) evento.attendees = [];

    // Validar cupo del evento
    const max = Number(evento.max_attendees ?? 0);
    if (
      evento.attendees.includes(idAsistente) ||
      (max > 0 && evento.attendees.length >= max)
    ) {
      await redisClient.unwatch();
      return res.status(400).json({ error: "No se puede inscribir al evento" });
    }

    // Traer eventos del asistente
    let attendeeData = await redisClient.hGet(KEY_ATTENDEES, idAsistente);
    let attendee = attendeeData ? JSON.parse(attendeeData) : { events: [] };

    // Si ya aparece en el historial del usuario, evitar duplicados
    if (Array.isArray(attendee.events) && attendee.events.includes(idEvento)) {
      await redisClient.unwatch();
      return res.status(400).json({ error: "Ya estás inscrito en este evento" });
    }

    // Límite máximo por usuario
    if (attendee.events.length >= MAX_ALLOWED_EVENTS) {
      await redisClient.unwatch();
      return res
        .status(400)
        .json({ error: `Ya estás inscrito en ${MAX_ALLOWED_EVENTS} eventos.` });
    }

    // --- Validación de traslape de horarios (solo para eventos no-materia) ---
    if (!isSubjectEvent) {
      const newStart = makeDateTime(evento.date, evento.start_time);
      const newEnd = makeDateTime(evento.date, evento.end_time);

      if (
        !newStart.isValid() ||
        !newEnd.isValid() ||
        !newEnd.isAfter(newStart)
      ) {
        await redisClient.unwatch();
        return res
          .status(400)
          .json({ error: "Horario inválido para el evento nuevo." });
      }

      // Buscar conflictos con eventos no-materia del usuario
      const conflict = attendee.events
        .map((evId) => eventos.find((e) => e.id === evId))
        .filter(Boolean)
        .filter((e) => !e.is_subject)
        .find((e) => {
          if ((e.date || "").trim() !== (evento.date || "").trim()) return false;

          const s = makeDateTime(e.date, e.start_time);
          const t = makeDateTime(e.date, e.end_time);
          if (!s.isValid() || !t.isValid() || !t.isAfter(s)) return false;

          return intervalsOverlap(newStart, newEnd, s, t);
        });

      if (conflict) {
        await redisClient.unwatch();
        return res.status(400).json({
          error: "Conflicto de horario con otro evento inscrito.",
          conflict_with: {
            id: conflict.id,
            name: conflict.name,
            date: conflict.date,
            start_time: conflict.start_time,
            end_time: conflict.end_time,
          },
        });
      }
    }
    // --- Fin validación de traslape ---

    // Registrar inscripción (transacción)
    evento.attendees.push(idAsistente);
    const multi = redisClient.multi();
    if (source === "events") {
      eventos[index] = evento;
      multi.json.set(KEY_EVENTS, "$", eventos);
    } else {
      multi.hSet(KEY_MATERIAS, idEvento, JSON.stringify(evento));
    }
    await multi.exec();

    attendee.events.push(idEvento);
    await redisClient.hSet(
      KEY_ATTENDEES,
      idAsistente,
      JSON.stringify(attendee),
    );

    res.status(200).json({ message: "Inscrito correctamente", ok: true });
  } catch (error) {
    console.error("Error inscribiendo al evento:", error);
    res.status(500).json({ error: error.message });
  }
}

async function handlerUnsubscribe(req, res) {
  const idEvento = req.body.event_id;
  const idAsistente = req.body.user_id;

  try {
    const eventos = (await redisClient.json.get(KEY_EVENTS)) || [];
    const index = eventos.findIndex((e) => e.id === idEvento);
    let evento = index >= 0 ? eventos[index] : null;
    let source = "events";

    if (!evento) {
      const materiaStr = await redisClient.hGet(KEY_MATERIAS, idEvento);
      if (materiaStr) {
        evento = JSON.parse(materiaStr);
        source = "subjects";
      }
    }

    if (!evento)
      return res.status(404).json({ error: "Evento no encontrado" });

    if (evento.is_subject) {
      return res.status(400).json({
        error:
          "Las materias no permiten baja automática. Admin debe editar la lista suscribed.",
      });
    }

    if (!Array.isArray(evento.attendees)) evento.attendees = [];

    let attendeeData = await redisClient.hGet(KEY_ATTENDEES, idAsistente);
    let attendee = attendeeData ? JSON.parse(attendeeData) : { events: [] };

    const inEvent = evento.attendees.includes(idAsistente);
    const inAttendee = Array.isArray(attendee.events)
      ? attendee.events.includes(idEvento)
      : false;

    if (!inEvent && !inAttendee) {
      return res.status(400).json({ error: "No estás inscrito a este evento" });
    }

    evento.attendees = evento.attendees.filter((id) => id !== idAsistente);
    if (source === "events") {
      eventos[index] = evento;
      await redisClient.json.set(KEY_EVENTS, "$", eventos);
    } else {
      await redisClient.hSet(KEY_MATERIAS, idEvento, JSON.stringify(evento));
    }

    attendee.events = attendee.events.filter((id) => id !== idEvento);
    await redisClient.hSet(
      KEY_ATTENDEES,
      idAsistente,
      JSON.stringify(attendee),
    );

    res.status(200).send("Desinscrito correctamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Rutas nuevas
app.post("/api/evento/attendees/subscribe", handlerSubscribe);
app.post("/api/evento/attendees/unsubscribe", handlerUnsubscribe);

// Alias retro-compatibles (deprecados)
app.post("/api/evento/atendees/suscribe", handlerSubscribe);
app.post("/api/evento/atendees/unsuscribe", handlerUnsubscribe);

// ---- Listar eventos por usuario ----
async function handlerEventsByAttendee(req, res) {
  try {
    const idAsistente = req.params.id;
    const attendeeData = await redisClient.hGet(KEY_ATTENDEES, idAsistente);
    const attendee = attendeeData ? JSON.parse(attendeeData) : { events: [] };
    const enrolledEventIds = new Set(Array.isArray(attendee.events) ? attendee.events : []);

    // Compatibilidad: sincronizar también con materias que guarden attendees por separado
    const materias = (await redisClient.hGetAll(KEY_MATERIAS)) || {};
    for (const [id, matStr] of Object.entries(materias)) {
      if (id === "init") continue;
      try {
        const mat = JSON.parse(matStr);
        const attendeeIds = Array.isArray(mat.attendees)
          ? mat.attendees.map((s) => String(s))
          : Array.isArray(mat.suscribed)
            ? mat.suscribed.map((s) =>
              typeof s === "object" && s !== null ? String(s.id || "") : String(s),
            )
          : [];
        if (attendeeIds.includes(String(idAsistente))) {
          enrolledEventIds.add(id);
        }
      } catch (error) {
        console.error("Error al parsear materia en consulta por asistente:", error);
      }
    }

    res.status(200).json(Array.from(enrolledEventIds));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

app.get("/api/evento/attendee/:id", handlerEventsByAttendee);
// Alias retro-compatibles
app.get("/api/evento/atendee/:id", handlerEventsByAttendee);

// ---- Toggle manual de asistencia para materias (admin) ----
app.patch("/api/evento/subject/attendance", requireAdmin, async (req, res) => {
  try {
    const eventId = String(req.body?.event_id || "").trim();
    const userId = String(req.body?.user_id || "").trim();
    const date = String(req.body?.date || "").trim();

    if (!eventId || !userId || !date) {
      return res.status(400).json({
        error: "event_id, user_id y date son requeridos",
      });
    }

    if (!moment(date, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({
        error: "date debe tener formato YYYY-MM-DD",
      });
    }

    const materiaStr = await redisClient.hGet(KEY_MATERIAS, eventId);
    if (!materiaStr) {
      return res.status(404).json({ error: "Materia no encontrada" });
    }

    const materia = JSON.parse(materiaStr);
    if (!materia?.is_subject) {
      return res.status(400).json({
        error: "El endpoint solo aplica para eventos tipo materia",
      });
    }

    if (!Array.isArray(materia.attendees)) {
      materia.attendees = Array.isArray(materia.suscribed)
        ? materia.suscribed.map((s) =>
            typeof s === "object" && s !== null ? String(s.id || "") : String(s),
          ).filter(Boolean)
        : [];
    }

    if (!materia.attendees.map((x) => String(x)).includes(userId)) {
      materia.attendees.push(userId);
    }

    if (!materia.attendance || typeof materia.attendance !== "object") {
      materia.attendance = {};
    }

    const current = Array.isArray(materia.attendance[date])
      ? materia.attendance[date].map((x) => String(x))
      : [];

    let present = false;
    if (current.includes(userId)) {
      materia.attendance[date] = current.filter((x) => x !== userId);
      present = false;
    } else {
      materia.attendance[date] = [...current, userId];
      present = true;
    }

    if (Array.isArray(materia.attendance[date]) && materia.attendance[date].length === 0) {
      delete materia.attendance[date];
    }

    await redisClient.hSet(KEY_MATERIAS, eventId, JSON.stringify(materia));

    return res.status(200).json({
      ok: true,
      event_id: eventId,
      user_id: userId,
      date,
      present,
      message: present ? "Asistencia marcada" : "Asistencia desmarcada",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- Registrar visita ----
app.post("/api/evento/visit", async (req, res) => {
  const idEvento = req.body.event_id;
  const idAsistente = req.body.user_id;
  const qrType = Number(req.body.qr_type);
  const requestedAttendanceDate = (req.body.attendance_date || "").trim();

  try {
    const eventos = (await redisClient.json.get(KEY_EVENTS)) || [];
    const eventIndex = eventos.findIndex((e) => e.id === idEvento);
    let evento = eventIndex >= 0 ? eventos[eventIndex] : null;
    let source = "events";

    const shouldUseSubjects = qrType === 1 || (qrType !== 0 && !evento);
    if (shouldUseSubjects) {
      const materiaStr = await redisClient.hGet(KEY_MATERIAS, idEvento);
      if (materiaStr) {
        evento = JSON.parse(materiaStr);
        source = "subjects";
      }
    }

    if (!evento && qrType === 0) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    if (!evento) {
      return res.status(404).json({ error: "Evento o materia no encontrada" });
    }

    // Para materias: guardar asistencia por fecha en attendance[YYYY-MM-DD]
    if (source === "subjects") {
      if (!Array.isArray(evento.attendees)) {
        evento.attendees = Array.isArray(evento.suscribed)
          ? evento.suscribed.map((s) =>
              typeof s === "object" && s !== null ? String(s.id || "") : String(s),
            ).filter(Boolean)
          : [];
      }

      if (!evento.attendees.map((x) => String(x)).includes(String(idAsistente))) {
        evento.attendees.push(String(idAsistente));
      }

      if (!evento.attendance || typeof evento.attendance !== "object") {
        evento.attendance = {};
      }

      const todayLocal = moment().format("YYYY-MM-DD");
      const attendanceDate =
        requestedAttendanceDate &&
        moment(requestedAttendanceDate, "YYYY-MM-DD", true).isValid()
          ? requestedAttendanceDate
          : todayLocal;

      const normalizedAttendanceDate = moment(
        attendanceDate,
        "YYYY-MM-DD",
        true,
      ).isAfter(moment(todayLocal, "YYYY-MM-DD", true))
        ? todayLocal
        : attendanceDate;

      if (!Array.isArray(evento.attendance[normalizedAttendanceDate])) {
        evento.attendance[normalizedAttendanceDate] = [];
      }

      if (evento.attendance[normalizedAttendanceDate].includes(idAsistente)) {
        return res.status(400).json({
          error: `Asistencia ya registrada para ${idAsistente} en ${normalizedAttendanceDate}`,
        });
      }

      evento.attendance[normalizedAttendanceDate].push(idAsistente);
    } else {
      if (!Array.isArray(evento.attendees)) evento.attendees = [];
      if (!evento.attendees.map((x) => String(x)).includes(String(idAsistente))) {
        evento.attendees.push(String(idAsistente));
      }

      if (!Array.isArray(evento.visits)) evento.visits = [];
      if (evento.visits.includes(idAsistente)) {
        return res.status(400).json({
          error: `Visita ya registrada para: ${idAsistente}`,
        });
      }
      evento.visits.push(idAsistente);
    }

    if (source === "events") {
      eventos[eventIndex] = evento;
      await redisClient.json.set(KEY_EVENTS, "$", eventos);
    } else {
      await redisClient.hSet(KEY_MATERIAS, idEvento, JSON.stringify(evento));
    }

    res.status(200).json({
      message: `Visita registrada correctamente para: ${idAsistente}`,
      ok: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---- Reporte CSV ----
app.get("/api/report/csv", requireAdmin, async (req, res) => {
  try {
    const eventos = (await redisClient.json.get(KEY_EVENTS)) || [];
    let reportData = [];

    for (let evento of eventos) {
      const eventName = evento.name;
      const eventDate = evento.date;
      const eventStartTime = evento.start_time;
      const eventEndTime = evento.end_time;

      const duration = moment.duration(
        moment(eventEndTime, "HH:mm").diff(moment(eventStartTime, "HH:mm")),
      );
      const totalEventTime = duration.asHours();

      const attendees = Array.isArray(evento.attendees) ? evento.attendees : [];
      const visits = Array.isArray(evento.visits) ? evento.visits : [];

      for (let attendeeId of attendees) {
        try {
          await redisClient.hGet(KEY_ATTENDEES, attendeeId); // se puede usar para enriquecer
          reportData.push({
            account_number: attendeeId,
            event_name: eventName,
            event_date: eventDate,
            event_time: eventStartTime,
            event_time_end: eventEndTime,
            total_event_time: totalEventTime.toFixed(2),
            attended: visits.includes(attendeeId) ? "Yes" : "No",
          });
        } catch (error) {
          console.log("Error en generación de reporte: " + error);
          console.log("Evento: " + eventName);
          console.log("Cuenta: " + attendeeId);
        }
      }
    }

    const fields = [
      "account_number",
      "event_name",
      "event_date",
      "event_time",
      "event_time_end",
      "total_event_time",
      "attended",
    ];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(reportData);

    res.header("Content-Type", "text/csv");
    res.attachment("report.csv");
    res.send(csv);
  } catch (error) {
    console.error("Failed to generate report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

// --- Manager login ---
app.post("/api/admin/login", async (req, res) => {
  try {
    console.log(req.body);

    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      console.log("Intento admin", username, password);

      const issued = await createAdminToken({ issuedFor: username });
      if (!issued)
        return res.status(500).json({ error: "No se pudo crear token" });
      // Devuelve token y metadatos de expiración
      return res.status(200).json({
        message: "Login successful",
        ok: true,
        token: issued.token,
        expiresIn: issued.expiresIn, // en segundos
        expiresAt: issued.expiresAt, // epoch ms
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Manager logout ---
app.post("/api/admin/logout", async (req, res) => {
  try {
    const auth = req.headers["authorization"] || "";
    const token = auth.startsWith("Bearer ")
      ? auth.slice(7).trim()
      : auth.trim();
    if (!token) return res.status(400).json({ error: "Token requerido" });
    await invalidateAdminToken(token);
    res.status(200).json({ ok: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/ping", requireAdmin, async (req, res) => {
  // Opcional: si quieres “sliding session”, aquí puedes refreshAdminToken(token)
  return res.status(200).json({ ok: true });
});

// ---- 404 JSON para rutas API desconocidas ----
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Unknown API route", path: req.originalUrl });
});

// ---- Catch-all para la SPA ----
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "svelte", "public", "index.html"));
});

// ---- Inicio del servidor ----
https.createServer(httpsOptions, app).listen(APP_PORT, async () => {
  await connectRedis();
  redisClient = getRedisClient();
  if (!redisClient) {
    throw new Error("Redis client no inicializado");
  }
  await verifyRedisKeys();
  console.log("HTTPS server running on port " + APP_PORT);
});
