const cors = require("cors");
const express = require("express");
const app = express();
const socketIO = require("socket.io");
const path = require("path");
var http = require("http");
let server, io;

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.static(path.join(__dirname, "/app")));

server = http.Server(app);
server.listen(PORT, () => console.log("server is listening on port " + PORT));
io = socketIO(server, {
  cors: {
    origin: "https://a-pleasant-experience.herokuapp.com/",
    methods: ["GET", "POST"],
  },
});
io = socketIO(server);
let users = [];

io.on("connection", (socket) => {
  console.log("a user connected");

  users.push({ id: socket.id, isPlaying: false, pitch: 0 });
  io.emit("userList", users);
  socket.on("userList", () => {
    console.log(users);
    socket.emit("userList", users);
  });

  socket.on("checkboxChange", (data) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == socket.id) {
        users[i].isPlaying = data.isPlaying;
        users[i].pitch = data.pitch;
      }
    }
    console.log(users);
    io.emit("userList", users);
  });

  socket.on("disconnect", () => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == socket.id) {
        users.splice(i, 1);
      }
    }
    io.emit("userList", users);
    console.log("Client disconnected", users);
  });
});
