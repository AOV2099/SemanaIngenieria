const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");
const { fileURLToPath } = require("url");
const cors = require("cors");
const APP_PORT = process.env.APP_PORT || 3000;
//redis
const redis = require("redis");
//uuid
const { v4: uuidv4 } = require("uuid");

const app = express();
// Middleware para servir archivos estáticos (Svelte)
app.use(express.static("public"));
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

let cert;
let key;

// Conexión a Redis
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'redis', // Utiliza 'localhost' si REDIS_HOST no está definido
  port: process.env.REDIS_PORT || 6379         // Utiliza 6379 si REDIS_PORT no está definido
});
function connectRedis() {
  console.log("Connecting to Redis...");

  redisClient.connect();

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
  if (!event.description) {
    console.log("description");
    return false;
  }
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
  console.log("Full path to bundle: ", fullPath);
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
  console.log("Full path to bundle: ", fullPath);
  res.sendFile(fullPath);
});

app.get("/global.css", (req, res) => {
  const fullPath = path.join(__dirname, "svelte", "public", "global.css");
  console.log("Full path to bundle: ", fullPath);
  res.sendFile(fullPath);
});

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
    const eventos = await redisClient.json.get(KEY_EVENTS);
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
    if (!isJsonEventCorrect(evento)) {
      res.status(400).json({ error: "Cuerpo de evento inválido" });
      return;
    }
    evento.id = uuidv4(); // Asegúrate de importar uuidv4 de 'uuid'
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
    eventos[index] = evento;
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

// Asegúrate de que cualquier otra ruta no específica devuelva tu archivo HTML principal de Svelte
// Rutas de API y otros manejadores específicos aquí

// Luego al final, tu capturador para SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "svelte", "public", "index.html"));
});

// Inscribirse a eventos (idAsistente, idEvento)
app.post("/api/evento/:idEvento/:idAsistente", async (req, res) => {
  console.log("POST /api/evento/:idEvento/:idAsistente");
  const idEvento = req.params.idEvento;
  const idAsistente = req.params.idAsistente;
  try {
    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === idEvento);
    if (index === -1) {
      res.status(404).json({ error: "Evento no encontrado" });
      return;
    }
    const evento = eventos[index];
    if (evento.attendees.includes(idAsistente)) {
      res.status(400).json({ error: "Ya estás inscrito en este evento" });
      return;
    }
    if (evento.attendees.length >= evento.max_attendees) {
      res.status(400).json({ error: "Evento lleno" });
      return;
    }
    evento.attendees.push(idAsistente);
    await redisClient.json.set(KEY_EVENTS, "$", eventos);
    res.status(200).send("Inscrito correctamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Desinscribirse de eventos (idAsistente, idEvento)
app.delete("/api/evento/:idEvento/:idAsistente", async (req, res) => {
  console.log("DELETE /api/evento/:idEvento/:idAsistente");
  const idEvento = req.params.idEvento;
  const idAsistente = req.params.idAsistente;
  try {
    const eventos = await redisClient.json.get(KEY_EVENTS);
    const index = eventos.findIndex((e) => e.id === idEvento);
    if (index === -1) {
      res.status(404).json({ error: "Evento no encontrado" });
      return;
    }
    const evento = eventos[index];
    const attendeeIndex = evento.attendees.findIndex((a) => a === idAsistente);
    if (attendeeIndex === -1) {
      res.status(400).json({ error: "No estás inscrito en este evento" });
      return;
    }
    evento.attendees.splice(attendeeIndex, 1);
    await redisClient.json.set(KEY_EVENTS, "$", eventos);
    res.status(200).send("Desinscrito correctamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



https.createServer(httpsOptions, app).listen(APP_PORT, () => {
  connectRedis();
  console.log("HTTPS server running on port" + APP_PORT);
});