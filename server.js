// server.js — Semana Ingeniería (corregido)
const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");
const cors = require("cors");
const { Parser } = require("json2csv");
const moment = require("moment");
const redis = require("redis");
const { v4: uuidv4 } = require("uuid");

// ---- Config ----
const APP_PORT = process.env.APP_PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const APP_MODE = process.env.APP_MODE || "0";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "password";

console.log("APP MODE", APP_MODE);
console.log("APP PORT", APP_PORT);
console.log("REDIS HOST", REDIS_HOST);
console.log("REDIS PORT", REDIS_PORT);

// ---- Constantes de claves ----
const KEY_EVENTS = "si:eventos";
const KEY_ATTENDEES = "si:alumnos";
const KEY_ADMIN_TOKENS = "si:tokens";
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
  })
);

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

// ---- Redis (con reconexión) ----
const redisClient = redis.createClient({
  socket: { host: REDIS_HOST, port: REDIS_PORT },
  password: process.env.REDIS_PASSWORD || "",
});
let reconnectInterval = null;

async function reconnectRedis() {
  try {
    if (!redisClient.isOpen) {
      console.log("Intentando reconectar a Redis...");
      await redisClient.connect();
      console.log("Conectado nuevamente a Redis.");
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
      }
    }
  } catch (error) {
    console.error("Error al intentar reconectar a Redis:", error);
  }
}

redisClient.on("error", (error) => console.error("Error en Redis:", error));
redisClient.on("end", () => {
  console.log("Conexión a Redis finalizada.");
  if (!reconnectInterval) {
    reconnectInterval = setInterval(reconnectRedis, 5000);
  }
});
redisClient.on("ready", () =>
  console.log("Redis listo para aceptar conexiones.")
);
redisClient.on("connect", () => {
  console.log(`Redis conectado: ${REDIS_HOST}:${REDIS_PORT}`);
});

async function connectRedis() {
  console.log("Conectando a Redis...");
  await reconnectRedis();
  redisClient.on("end", () => {
    console.log("Conexión a Redis finalizada");
    reconnectRedis();
  });
}

// ---- Bootstrap de datos ----
async function verifyRedisKeys() {
  try {
    const eventsExists = await redisClient.exists(KEY_EVENTS);
    const attendeesExists = await redisClient.exists(KEY_ATTENDEES);

    if (eventsExists && attendeesExists) {
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
    await redisClient.json.set(KEY_EVENTS, "$", [testEvent]);
    console.log("Clave de eventos creada con un evento de prueba.");

    await redisClient.hSet(
      KEY_ATTENDEES,
      "init",
      JSON.stringify({ events: [] })
    );
  } catch (error) {
    console.error("Error al verificar claves.", error);
  }
}

// ---- Utilidades ----
function isJsonEventCorrect(event) {
  if (!event.name) return false;
  if (!event.date) return false;
  if (!event.start_time) return false;
  if (!event.end_time) return false;
  if (!event.location) return false;
  if (!event.max_attendees) return false;
  if (!event.career) return false;
  if (!event.exponent) return false;
  if (!event.status) return false;
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
    path.join(__dirname, "svelte", "public", "img", `${req.params.imgid}`)
  );
});
app.get("/build/qr-scanner-worker.min*.js", (req, res) => {
  const fileName = req.path.split("/").pop();
  res.sendFile(path.join(__dirname, "svelte", "public", "build", fileName));
});

// ---- API de eventos ----

// Públicos (solo Activo) — no muta arrays internos; expone attendees como count
app.get("/api/eventos", async (req, res) => {
  try {
    const eventos = (await redisClient.json.get(KEY_EVENTS)) || [];
    const allowedEvents = eventos
      .filter((e) => isActiveStatus(e.status))
      .map((e) => ({
        ...e,
        attendees: Array.isArray(e.attendees) ? e.attendees.length : 0,
      }));
    res.status(200).json(allowedEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin (sin filtro)
app.get("/api/eventos_admin", requireAdmin, async (req, res) => {
  try {
    const eventos = (await redisClient.json.get(KEY_EVENTS)) || [];
    eventos.forEach((ev) => {
      if (!Array.isArray(ev.attendees)) ev.attendees = [];
      if (!Array.isArray(ev.visits)) ev.visits = [];
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
    if (!isJsonEventCorrect(evento)) {
      return res.status(400).json({ error: "Cuerpo de evento inválido" });
    }
    evento.id = uuidv4();
    if (!Array.isArray(evento.attendees)) evento.attendees = [];
    if (!Array.isArray(evento.visits)) evento.visits = [];

    const exists = await redisClient.exists(KEY_EVENTS);
    if (!exists) {
      await redisClient.json.set(KEY_EVENTS, "$", [evento]);
    } else {
      await redisClient.json.arrAppend(KEY_EVENTS, "$", evento);
    }
    res.status(200).send("Evento agregado correctamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar evento (merge)
app.put("/api/evento", requireAdmin, async (req, res) => {
  const evento = req.body;
  try {
    if (!isJsonEventCorrect(evento)) {
      return res.status(400).json({ error: "Cuerpo de evento inválido" });
    }
    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === evento.id);
    if (index === -1)
      return res.status(404).json({ error: "Evento no encontrado" });

    if (!Array.isArray(eventos[index].visits)) eventos[index].visits = [];
    if (!Array.isArray(eventos[index].attendees)) eventos[index].attendees = [];

    Object.assign(eventos[index], evento);

    await redisClient.json.set(KEY_EVENTS, "$", eventos);
    res.status(200).send("Evento actualizado correctamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar evento
app.delete("/api/evento/:id", requireAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === id);
    if (index === -1)
      return res.status(404).json({ error: "Evento no encontrado" });

    eventos.splice(index, 1);
    await redisClient.json.set(KEY_EVENTS, "$", eventos);
    res.status(200).send("Evento eliminado correctamente");
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

  try {
    await redisClient.watch(KEY_EVENTS);
    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === idEvento);
    if (index === -1) {
      await redisClient.unwatch();
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    const evento = eventos[index];
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

    // Límite máximo por usuario
    if (attendee.events.length >= MAX_ALLOWED_EVENTS) {
      await redisClient.unwatch();
      return res
        .status(400)
        .json({ error: `Ya estás inscrito en ${MAX_ALLOWED_EVENTS} eventos.` });
    }

    // --- Validación de traslape de horarios ---
    // Solo comparamos con eventos que existan todavía en la lista
    const newStart = makeDateTime(evento.date, evento.start_time);
    const newEnd = makeDateTime(evento.date, evento.end_time);

    if (!newStart.isValid() || !newEnd.isValid() || !newEnd.isAfter(newStart)) {
      await redisClient.unwatch();
      return res
        .status(400)
        .json({ error: "Horario inválido para el evento nuevo." });
    }

    // Buscar conflictos con los eventos a los que ya está inscrito el usuario
    const conflict = attendee.events
      .map((evId) => eventos.find((e) => e.id === evId))
      .filter(Boolean)
      .find((e) => {
        // Si la fecha es diferente, no hay conflicto
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
    // --- Fin validación de traslape ---

    // Registrar inscripción (transacción)
    evento.attendees.push(idAsistente);
    const multi = redisClient.multi();
    multi.json.set(KEY_EVENTS, "$", eventos);
    await multi.exec();

    attendee.events.push(idEvento);
    await redisClient.hSet(
      KEY_ATTENDEES,
      idAsistente,
      JSON.stringify(attendee)
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
    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === idEvento);
    if (index === -1)
      return res.status(404).json({ error: "Evento no encontrado" });

    const evento = eventos[index];
    if (!Array.isArray(evento.attendees)) evento.attendees = [];

    if (!evento.attendees.includes(idAsistente)) {
      return res.status(400).json({ error: "No estás inscrito a este evento" });
    }

    evento.attendees = evento.attendees.filter((id) => id !== idAsistente);
    await redisClient.json.set(KEY_EVENTS, "$", eventos);

    let attendeeData = await redisClient.hGet(KEY_ATTENDEES, idAsistente);
    let attendee = attendeeData ? JSON.parse(attendeeData) : { events: [] };
    attendee.events = attendee.events.filter((id) => id !== idEvento);
    await redisClient.hSet(
      KEY_ATTENDEES,
      idAsistente,
      JSON.stringify(attendee)
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
    const attendees = await redisClient.hGet(KEY_ATTENDEES, idAsistente);
    if (!attendees)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(JSON.parse(attendees).events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

app.get("/api/evento/attendee/:id", handlerEventsByAttendee);
// Alias retro-compatibles
app.get("/api/evento/atendee/:id", handlerEventsByAttendee);

// ---- Registrar visita ----
app.post("/api/evento/visit", async (req, res) => {
  const idEvento = req.body.event_id;
  const idAsistente = req.body.user_id;

  try {
    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === idEvento);
    if (index === -1)
      return res.status(404).json({ error: "Evento no encontrado" });

    const evento = eventos[index];
    if (!Array.isArray(evento.visits)) evento.visits = [];
    if (!Array.isArray(evento.attendees)) evento.attendees = [];

    if (evento.visits.includes(idAsistente)) {
      return res.status(400).json({
        error: `Visita ya registrada para: ${idAsistente}`,
      });
    }
    if (!evento.attendees.includes(idAsistente)) {
      return res.status(400).json({
        error: `El usuario ${idAsistente} no está inscrito al evento`,
      });
    }

    evento.visits.push(idAsistente);
    await redisClient.json.set(KEY_EVENTS, "$", eventos);

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
        moment(eventEndTime, "HH:mm").diff(moment(eventStartTime, "HH:mm"))
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
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
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
  await verifyRedisKeys();
  console.log("HTTPS server running on port " + APP_PORT);
});
