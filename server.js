const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");
const { fileURLToPath } = require("url");
const cors = require("cors");
const { exec } = require("child_process"); // Importar exec correctamente
const { Parser } = require('json2csv');
const moment = require('moment');

const APP_PORT = process.env.APP_PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || "localhost"; // Cambié REDIS_PORT a REDIS_HOST aquí
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const APP_MODE = process.env.APP_MODE || "0"; // Cambié REDIS_PORT a APP_MODE aquí
const redisURL = `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${
  process.env.REDIS_PORT || 6379
}`;

console.log("APP MODE", APP_MODE);
console.log("APP PORT", APP_PORT);
console.log("REDIS HOST", REDIS_HOST);
console.log("REDIS PORT", REDIS_PORT); // Cambié REDIS_HOST a REDIS_PORT aquí

//redis
const redis = require("redis");
let reconnectInterval = null;
//uuid
const { v4: uuidv4 } = require("uuid");
const { log } = require("console");
const { triggerAsyncId } = require("async_hooks");

const app = express();
// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

//uso de json
app.use(express.json());

app.use(
  cors({
    origin: "*", // Permite todos los orígenes
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true, // Permite cookies de origen cruzado
  })
);

const KEY_EVENTS = "UNAM_EVENTOS";
const KEY_ATTENDEES = "SI_ALUMNOS";

let cert;
let key;

// Conexión a Redis
/*const redisClient = redis.createClient({
  host: REDIS_HOST, // Utiliza 'localhost' si REDIS_HOST no está definido
  port: REDIS_PORT, // Utiliza 6379 si REDIS_PORT no está definido
});*/
/*const redisClient = redis.createClient({
  url: redisURL
});*/

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || "",
});

async function reconnectRedis() {
  try {
    if (!redisClient.isOpen) {
      console.log("Intentando reconectar a Redis...");
      await redisClient.connect();
      console.log("Conectado nuevamente a Redis.");

      // Detener el intervalo inmediatamente después de reconectar
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null; // Asegurarse de que se limpie el intervalo
        console.log("Reconexión exitosa, intervalo detenido.");
      }
    } else {
      console.log("Redis ya está conectado, no es necesario reconectar.");
    }
  } catch (error) {
    console.error("Error al intentar reconectar a Redis:", error);
  }
}

// Escuchar eventos de Redis
redisClient.on("error", (error) => {
  console.error("Error en Redis:", error);
});

redisClient.on("end", () => {
  console.log("Conexión a Redis finalizada.");

  // Solo iniciar el intervalo si no hay uno activo
  if (!reconnectInterval) {
    reconnectInterval = setInterval(async () => {
      try {
        await reconnectRedis();
      } catch (error) {
        console.error(
          "No se pudo reconectar a Redis, intentando nuevamente en 5 segundos..."
        );
      }
    }, 5000); // Reintentar cada 5 segundos
  }
});

redisClient.on("ready", () => {
  console.log("Redis listo para aceptar conexiones.");
});

redisClient.on("connect", () => {
  console.log("Redis conectado.");
});

async function reloadLastBackup() {
  try {
    console.log("Reiniciando Redis para cargar el último respaldo...");

    // Enviar comando SHUTDOWN NOSAVE para apagar Redis y forzar una recarga de datos
    await redisClient.sendCommand(["SHUTDOWN", "NOSAVE"]);

    console.log("Redis ha sido apagado, se recargará con el respaldo.");

    // Intentar reconectar después del reinicio
    setTimeout(async () => {
      try {
        console.log("Intentando reconectar a Redis después del reinicio...");
        await redisClient.connect();
        console.log("Reconectado a Redis después del reinicio.");
      } catch (reconnectError) {
        console.error("Error al intentar reconectar a Redis:", reconnectError);
      }
    }, 5000); // Esperar 5 segundos antes de intentar reconectar
  } catch (error) {
    console.error("Error al intentar reiniciar Redis:", error);
  }
}

async function triggerBgSave() {
  try {
    const eventsExists = await redisClient.exists("UNAM_EVENTOS");
    const attendeesExists = await redisClient.exists("SI_ALUMNOS");

    if (eventsExists && attendeesExists) {
      console.log("Las claves existen, iniciando BGSAVE en Redis...");
      await redisClient.sendCommand(["BGSAVE"]);
      console.log("BGSAVE iniciado correctamente");
    } else {
      console.log(
        "No se encontraron todas las claves requeridas, reiniciando Redis y cargando el respaldo..."
      );
      await reloadLastBackup();
    }
  } catch (error) {
    console.error(
      "Error al intentar ejecutar BGSAVE o cargar el respaldo:",
      error
    );
  }
}

async function connectRedis() {
  console.log("Conectando a Redis...");
  await reconnectRedis(); // Intentar reconectar si falla
  redisClient.on("end", () => {
    console.log("Conexión a Redis finalizada");
    reconnectRedis(); // Reintentar reconectar si se pierde la conexión
  });

  redisClient.on("ready", () => {
    console.log("Redis listo");
  });

  redisClient.on("connect", () => {
    console.log(
      `Redis conectado: ${redisClient.options.socket.host}:${redisClient.options.socket.port}`
    );
  });

  redisClient.on("error", (error) => {
    console.error("Error en Redis:", error);
  });
}

function isJsonEventCorrect(event) {
  //console.log(event);
  //validar que el evento tenga los campos necesarios
  /*if (
    //event.id && sin id
    event.name &&
    event.date &&
    event.start_time &&
    event.end_time &&
    event.location &&
    event.description &&
    event.attendees &&
    event.max_attendees &&
    event.career &&
    event.exponent &&
    event.status &&
    event.img
  ) {
    return true;
  }
  return false;*/

  if (!event.name) {
    console.log("name");
    return false;
  }
  if (!event.date) {
    console.log("date");
    return false;
  }
  if (!event.start_time) {
    console.log("start_time");
    return false;
  }
  if (!event.end_time) {
    console.log("end_time");
    return false;
  }
  if (!event.location) {
    console.log("location");
    return false;
  }
  /*if (!event.description) {
    console.log("description");
    return false;
  }*/
  if (!event.max_attendees) {
    console.log("max_attendees");
    return false;
  }
  if (!event.career) {
    console.log("career");
    return false;
  }
  if (!event.exponent) {
    console.log("exponent");
    return false;
  }
  if (!event.status) {
    console.log("status");
    return false;
  }
  /*if (!event.img) {
    console.log("img");
    return false;
  }*/
  return true;
}

// Intenta leer los archivos de certificado y clave
try {
  cert = fs.readFileSync("./localhost.pem", "utf8");
  key = fs.readFileSync("./localhost-key.pem", "utf8");

  console.log("Successfully read cert and key files:");
  console.log("Certificate:", cert.substring(0, 100) + "...");
  console.log("Key:", key.substring(0, 100) + "...");
} catch (error) {
  console.error("Failed to read cert or key files:", error);
}

// Rutas para tus certificados generados con mkcert
const httpsOptions = {
  key: key,
  cert: cert,
};

app.get("/build/bundle.css", (req, res) => {
  const fullPath = path.join(__dirname, "svelte", "public", "build", "bundle.css");
  //console.log("Full path to bundle: ", fullPath);
  res.sendFile(fullPath);
});

app.get("/build/bundle.js", (req, res) => {
  const fullPath = path.join(__dirname, "svelte", "public", "build", "bundle.js");
  //console.log("Full path to bundle: ", fullPath);
  res.sendFile(fullPath);
});

app.get("/global.css", (req, res) => {
  const fullPath = path.join(__dirname, "svelte", "public", "global.css");
  //console.log("Full path to bundle: ", fullPath);
  res.sendFile(fullPath);
});

app.get("/img/:imgid", (req, res) => {
  const imgid = req.params.imgid;
  const fullPath = path.join(__dirname, "svelte", "public", "img", `${imgid}`);
  //console.log("Full path to bundle: ", fullPath);
  res.sendFile(fullPath);
});

//get images
/*app.get("/img/:img_name", async (req, res) => {
  const imgName = req.params.img_name;
  const imgPath = path.join(__dirname, "svelte", "public", "img", imgName);
  res.sendFile
  (imgPath);

});*/

app.get("/build/qr-scanner-worker.min*.js", (req, res) => {
  const fileName = req.path.split("/").pop(); // Obtiene el nombre del archivo desde la URL
  const fullPath = path.join(__dirname, "svelte", "public", "build", fileName);
  console.log("Full path to QR Scanner Worker: ", fullPath);
  res.sendFile(fullPath);
});

//get eventos from redis
app.get("/api/eventos", async (req, res) => {
  console.log("GET /api/eventos ...");
  //ibtener json de redis
  try {
    let allowedEvents = [];
    const eventos = await redisClient.json.get(KEY_EVENTS);

    eventos.forEach((evento) => {
      if (!evento.attendees) {
        evento.attendees = [];
      }
      //retornar unicamente el numero de asistentes por seguridad
      evento.attendees = evento.attendees.length;
      //si los eventos no estan activos no se muestran
      console.log(evento.status);
      if (evento.status === "Activo") {
        allowedEvents.push(evento);
      }
    });

    res.status(200).json(allowedEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/eventos_admin", async (req, res) => {
  console.log("GET /api/eventos ...");
  //ibtener json de redis
  try {
    const eventos = await redisClient.json.get(KEY_EVENTS);

    eventos.forEach((evento) => {
      if (!evento.attendees) {
        evento.attendees = [];
      }
    });

    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar evento a Redis
app.post("/api/evento", async (req, res) => {
  console.log("POST /api/evento");
  const evento = req.body;
  try {
    console.log("Agregando evento:", evento);
    if (!isJsonEventCorrect(evento)) {
      res.status(400).json({ error: "Cuerpo de evento inválido" });
      return;
    } else {
      console.log("cuerpo valido");
    }
    evento.id = uuidv4(); // Asegúrate de importar uuidv4 de 'uuid'
    evento.visits = [];
    const exists = await redisClient.exists(KEY_EVENTS);

    if (!exists) {
      await redisClient.json.set(KEY_EVENTS, "$", [evento]); // Guarda un nuevo array si no existe
    } else {
      await redisClient.json.arrAppend(KEY_EVENTS, "$", evento); // Añade al array existente
    }

    res.status(200).send("Evento agregado correctamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update evento
app.put("/api/evento", async (req, res) => {
  console.log("PUT /api/evento");
  const evento = req.body;
  try {
    if (!isJsonEventCorrect(evento)) {
      res.status(400).json({ error: "Cuerpo de evento inválido" });
      return;
    }
    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === evento.id);
    if (index === -1) {
      res.status(404).json({ error: "Evento no encontrado" });
      return;
    }
    //Check if event.visits exists, create it if not
    if (!eventos[index].visits) {
      eventos[index].visits = [];
    }

    //actualizar evento sin borrar info previa
    for (const key in evento) {
      eventos[index][key] = evento[key];
    }

    await redisClient.json.set(KEY_EVENTS, "$", eventos);
    res.status(200).send("Evento actualizado correctamente");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//delete evento
app.delete("/api/evento/:id", async (req, res) => {
  console.log("DELETE /api/evento");
  const id = req.params.id;
  try {
    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Evento no encontrado" });
      return;
    }
    eventos.splice(index, 1);
    await redisClient.json.set(KEY_EVENTS, "$", eventos);
    res.status(200).send("Evento eliminado correctamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inscribirse a eventos (idAsistente, idEvento)
app.post("/api/evento/atendees/suscribe", async (req, res) => {
  console.log("POST /api/evento/atendees/suscribe");
  const idEvento = req.body.event_id;
  const idAsistente = req.body.user_id;

  try {
    await redisClient.watch(KEY_EVENTS); // Observar cambios en KEY_EVENTS

    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === idEvento);
    if (index === -1) {
      redisClient.unwatch(); // Dejar de observar si no se encuentra el evento
      res.status(404).json({ error: "Evento no encontrado" });
      return;
    }
    const evento = eventos[index];

    if (!evento.attendees) {
      evento.attendees = [];
    }

    if (evento.attendees.includes(idAsistente) || evento.attendees.length >= evento.max_attendees) {
      redisClient.unwatch(); // Dejar de observar si ya está inscrito o si no hay cupo
      res.status(400).json({ error: "No se puede inscribir al evento" });
      return;
    }

    evento.attendees.push(idAsistente);

    const multi = redisClient.multi(); // Iniciar una transacción
    multi.json.set(KEY_EVENTS, "$", eventos);
    await multi.exec(); // Ejecutar la transacción

    // Manejar la inscripción del asistente a sus eventos
    let attendeeData = await redisClient.hGet(KEY_ATTENDEES, idAsistente);
    let attendee = attendeeData ? JSON.parse(attendeeData) : { events: [] };
    attendee.events.push(idEvento);
    await redisClient.hSet(KEY_ATTENDEES, idAsistente, JSON.stringify(attendee));

    res.status(200).json({ message: "Inscrito correctamente", ok: true });
  } catch (error) {
    console.error("Error inscribiendo al evento:", error);
    res.status(500).json({ error: error.message });
  }
});


//desinscribirse de un evento
app.post("/api/evento/atendees/unsuscribe", async (req, res) => {
  console.log("POST /api/evento/atendees/unsuscribe");
  const idEvento = req.body.event_id;
  const idAsistente = req.body.user_id;

  try {
    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === idEvento);
    if (index === -1) {
      res.status(404).json({ error: "Evento no encontrado" });
      return;
    }
    const evento = eventos[index];

    if (!evento.attendees) {
      evento.attendees = [];
    }

    // Verificar si el asistente ya está inscrito
    if (!evento.attendees.includes(idAsistente)) {
      res.status(400).json({ error: "No estás inscrito a este evento" });
      return;
    }

    // Eliminar asistente del evento
    evento.attendees = evento.attendees.filter((id) => id !== idAsistente);
    await redisClient.json.set(KEY_EVENTS, "$", eventos);

    // Manejar la inscripción del asistente a sus eventos
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
});

//obtener lista de eventos inscritos por usuario
app.get("/api/evento/atendee/:id", async (req, res) => {
  try {
    console.log("GET /api/evento/atendee/:id");
    const idAsistente = req.params.id;
    const attendees = await redisClient.hGet(KEY_ATTENDEES, idAsistente);
    //console.log(attendees);
    if (!attendees) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(JSON.parse(attendees).events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//refistrar visitas
app.post("/api/evento/visit", async (req, res) => {
  console.log("POST /api/evento/visit");
  const idEvento = req.body.event_id;
  const idAsistente = req.body.user_id;

  console.log("idEvento", idEvento);
  console.log("idAsistente", idAsistente);

  try {
    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === idEvento);
    if (index === -1) {
      res.status(404).json({ error: "Evento no encontrado" });
      return;
    }
    const evento = eventos[index];

    if (!evento.visits) {
      evento.visits = [];
    }

    // Verificar si el asistente ya está inscrito
    if (evento.visits.includes(idAsistente)) {
      res.status(400).json({
        error: "Visita ya registrada para este evento de: " + idAsistente,
      });
      return;
    }

    // verificamos que el usuario esté inscrito al evento
    if (!evento.attendees.includes(idAsistente)) {
      res.status(400).json({ error: "El usuario no está inscrito al evento" });
      return;
    }

    // Añadir asistente al evento
    evento.visits.push(idAsistente);
    await redisClient.json.set(KEY_EVENTS, "$", eventos);

    res.status(200).json({
      message: "Visita registrada correctamente para: " + idAsistente,
      ok: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//csv de visitas

app.get("/api/report/csv", async (req, res) => {
  try {
      // Obtener todos los eventos
      const eventos = await redisClient.json.get(KEY_EVENTS) || [];
      let reportData = [];

      for (let evento of eventos) {
          const eventName = evento.name;
          const eventDate = evento.date;
          const eventStartTime = evento.start_time;
          const eventEndTime = evento.end_time;

          // Calcular la duración total del evento en horas
          const duration = moment.duration(moment(eventEndTime, "HH:mm").diff(moment(eventStartTime, "HH:mm")));
          const totalEventTime = duration.asHours(); // Duración en horas con decimal

          // Asegurarse de que evento.attendees y evento.visits sean arreglos
          const attendees = Array.isArray(evento.attendees) ? evento.attendees : [];
          const visits = Array.isArray(evento.visits) ? evento.visits : [];

          // Obtener datos de asistentes
          for (let attendeeId of attendees) {
              try {
                  const attendeeData = await redisClient.hGet(KEY_ATTENDEES, attendeeId);
                  reportData.push({
                      account_number: attendeeId,
                      event_name: eventName,
                      event_date: eventDate,
                      event_time: eventStartTime,
                      event_time_end: eventEndTime,
                      total_event_time: totalEventTime.toFixed(2), // Formatear a dos decimales
                      attended: visits.includes(attendeeId) ? 'Yes' : 'No'
                  });
              } catch (error) {
                  console.log("Error en generación de reporte: " + error);
                  console.log("Evento: " + eventName);
                  console.log("Cuenta: " + attendeeId);
              }
          }
      }

      // Configuración para json2csv
      const fields = ['account_number', 'event_name', 'event_date', 'event_time', 'event_time_end', 'total_event_time', 'attended'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(reportData);

      res.header('Content-Type', 'text/csv');
      res.attachment('report.csv');
      res.send(csv);
  } catch (error) {
      console.error("Failed to generate report:", error);
      res.status(500).json({ error: "Failed to generate report" });
  }
});
// Asegúrate de que cualquier otra ruta no específica devuelva tu archivo HTML principal de Svelte
// Rutas de API y otros manejadores específicos aquí

// Luego al final, tu capturador para SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "svelte", "public", "index.html"));
});

https.createServer(httpsOptions, app).listen(APP_PORT, async () => {
  await connectRedis();
  triggerBgSave();
  //5 minutos
  setInterval(triggerBgSave, 1000 * 60 * 1); // 5 minutos
  console.log("HTTPS server running on port" + APP_PORT);
});
