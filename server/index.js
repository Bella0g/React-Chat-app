const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Use CORS middleware to handle cross-origin requests
app.use(cors());

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Create a new instance of the Socket.io server and configure CORS settings
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Event handler for when a client connects to the Socket.io server
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    // Event handler for when a client sends a "send_message" message
    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data);
    });

    // Event handler for when a client disconnects from the Socket.io server
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// Start the HTTP server and listen on port 3001
server.listen(3001, () => {
    console.log("SERVER RUNNING");
});