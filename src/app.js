const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mainRouter = require("./routes");
const fileUpload = require("express-fileupload");
require("./db.js");

const {createServer} = require('http')



const cors = require("cors");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const path = require("path");



const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentacion API Elfestin",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://pf-server-production.up.railway.app",
      },
    ],
  },
  apis: [`${path.join(__dirname, "./routes/*.js")}`],
};

const server = express();

server.name = "API";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

server.use(cors());
server.use((req, res, next) => {
  res.setHeader(
    "Set-Cookie",
    "cross-site-cookie=whatever; SameSite=None; Secure"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//resApi
server.use(
  "/api-doc",
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(swaggerSpec))
);

//procesamiento de imagenes del front
server.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads/",
  })
);

server.use(mainRouter);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

// const app = createServer(server);
// const { Server } = require('socket.io');
/*const io = new Server(app, {
  cors: {
    origin: ["http://localhost:3000"],
   },
 });*/
 

//fillDb();
module.exports = { app: server };