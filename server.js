const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");
const { fileURLToPath } = require("url");
const cors = require("cors");

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
//uuid
const { v4: uuidv4 } = require("uuid");
const { log } = require("console");

const app = express();
// Middleware para servir archivos estáticos
app.use(express.static("public")); // Sirve archivos estáticos desde /app/public

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
});

async function connectRedis() {
  console.log("Connecting to Redis...");

  try {
    await redisClient.connect();
    console.log(
      `Connected to Redis at ${redisClient.options.socket.host}:${redisClient.options.socket.port}`
    );
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }

  redisClient.on("end", () => {
    console.log("Redis connection ended");
  });

  redisClient.on("reconnecting", () => {
    console.log("Redis reconnecting...");
  });

  redisClient.on("ready", () => {
    console.log("Redis ready");
  });

  redisClient.on("connect", () => {
    //print redis connection data
    console.log("redis client:", redisClient.host, redisClient.port);

    console.log("Redis connected");
  });

  redisClient.on("error", (error) => {
    console.error(error);
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
  const fullPath = path.join(
    __dirname,
    "svelte",
    "public",
    "build",
    "bundle.css"
  );
  //console.log("Full path to bundle: ", fullPath);
  res.sendFile(fullPath);
});

app.get("/build/bundle.js", (req, res) => {
  const fullPath = path.join(
    __dirname,
    "svelte",
    "public",
    "build",
    "bundle.js"
  );
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
  const fullPath = path.join(
    __dirname,
    "svelte",
    "public",
    "img",
    `${imgid}`
  );
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
    }else{
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
    if (evento.attendees.includes(idAsistente)) {
      //console.log("Ya inscrito", idAsistente);
      res.status(400).json({ error: "Ya estás inscrito a este evento" });
      return;
    }

    // Verificar cupo disponible
    if (evento.attendees.length >= evento.max_attendees) {
      //console.log("Evento lleno", idAsistente);
      res.status(400).json({ error: "Evento lleno" });
      return;
    }

    // Añadir asistente al evento
    evento.attendees.push(idAsistente);
    await redisClient.json.set(KEY_EVENTS, "$", eventos);

    // Manejar la inscripción del asistente a sus eventos
    let attendeeData = await redisClient.hGet(KEY_ATTENDEES, idAsistente);
    let attendee = attendeeData ? JSON.parse(attendeeData) : { events: [] };

    attendee.events.push(idEvento);
    await redisClient.hSet(
      KEY_ATTENDEES,
      idAsistente,
      JSON.stringify(attendee)
    );

    res.status(200).json({ message: "Inscrito correctamente", ok: true });
  } catch (error) {
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
      res.status(400).json({ error: "Visita ya registrada para este evento de: " + idAsistente });
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

    res.status(200).json({ message: "Visita registrada correctamente para: " + idAsistente, ok: true});
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  console.log("HTTPS server running on port" + APP_PORT);
});
