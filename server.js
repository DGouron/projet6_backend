const http = require("http");
const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config();

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "3000");
console.log("Starting server... Port -> " + port);

app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  console.log("Listenning on " + bind);
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected.");
});

mongoose.connection.on("connected", () => {
  console.log("mongoDB connected.");
});

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    console.log("Connexion to mongoDB failed.");
    throw error;
  }
};

server.listen(port, () => {
  connectToMongo();
  console.log("Connected to backend.");
});
