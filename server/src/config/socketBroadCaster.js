const { Server } = require("socket.io");
const http = require("http");

let io = null;

const initializeSocket = (app) => {
  let server = http.createServer(app);
  io = new Server(server);

  // On client connection
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Optional: send a welcome log
    socket.emit("log", "Connected to server log stream");

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  return server;
};

// Log broadcasting function
const broadcastLog = (message) => {
  console.log(message); // still log to terminal
  if (!io) {
    console.error("Socket.io not initialized");
    return;
  }
  io.emit("log", message); // send to all connected clients
};

module.exports = {
  broadcastLog,
  initializeSocket,
};
