// This file sets up a Socket.IO server for real-time communication and provides
// functionality to broadcast logs to all connected clients.

const { Server } = require("socket.io");
const http = require("http");

let io = null;

// Initializes the Socket.IO server and attaches it to the provided HTTP app
const initializeSocket = (app) => {
  let server = http.createServer(app); // Create an HTTP server using the provided app
  io = new Server(server); // Initialize Socket.IO with the server

  // Handle client connections
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id); // Log when a client connects

    // Send a welcome message to the connected client
    socket.emit("log", "Connected to server log stream");

    // Handle client disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id); // Log when a client disconnects
    });
  });
  return server; // Return the server instance
};

// Broadcasts a log message to all connected clients
const broadcastLog = (message) => {
  console.log(message); // Log the message to the terminal
  if (!io) {
    console.error("Socket.io not initialized"); // Error if Socket.IO is not initialized
    return;
  }
  io.emit("log", message); // Emit the log message to all connected clients
};

module.exports = {
  broadcastLog, // Export the log broadcasting function
  initializeSocket, // Export the Socket.IO initialization function
};
