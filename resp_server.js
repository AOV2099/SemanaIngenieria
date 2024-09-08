const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");
const { fileURLToPath } = require("url");
const cors = require("cors");

const APP_PORT = process.env.APP_PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || "https://13.58.164.15"; // Cambié REDIS_PORT a REDIS_HOST aquí
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const APP_MODE = process.env.APP_MODE || "0"; // Cambié REDIS_PORT a APP_MODE aquí

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
    host: process.env.REDIS_HOST || "https://13.58.164.15",
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

connectRedis();

//backup redis data in local file
function backupData() {
  redisClient.save();
  
}