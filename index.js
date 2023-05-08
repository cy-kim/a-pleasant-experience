const cors = require("cors");
const express = require("express");
const app = express();
const socketIO = require("socket.io")(httpServer, {
  cors: {
    origin: "https://a-pleasant-experience.herokuapp.com/",
    methods: ["GET", "POST"],
    withCredentials: true,
  },
});
const path = require("path");
var http = require("http");
let server, io;

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.static(path.join(__dirname, "/app")));

server = http.Server(app);
server.listen(PORT);
io = socketIO(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", `${socket.id.substr(0, 2)} said ${message}`);
  });
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// setInterval(() => io.emit("time", new Date().toTimeString()), 1000);
