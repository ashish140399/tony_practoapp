// server.js (Node.js + Express + Socket.io setup)
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = 4000;
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("showQuestion", (data) => {
        // Relay the question to examinee when examiner presses the button
        io.emit("displayQuestion", data);
    });

    socket.on("optionSelected", (data) => {
        // Send the selected option back to examiner
        io.emit("updateExaminer", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log("Socket.io server listening on port 4000");
});
