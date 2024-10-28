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

// Keep track of connected users and their room assignments
let connectedUsers = {
    examiners: {}, // Stores examiner socket ID keyed by room ID
    examinees: {}, // Stores examinee socket ID keyed by room ID
};

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle role assignment: examiner or examinee with roomId
    socket.on("assignRole", ({ role, roomId }) => {
        if (role === "examiner") {
            // Examiner joins a room based on roomId
            socket.join(roomId);
            connectedUsers.examiners[roomId] = socket.id;
            console.log(`Examiner ${socket.id} joined room: ${roomId}`);
        } else if (role === "examinee") {
            // Examinee joins the same room based on roomId
            socket.join(roomId);
            connectedUsers.examinees[roomId] = socket.id;
            console.log(`Examinee ${socket.id} joined room: ${roomId}`);
        }

        // Log the connected users list
        logConnectedUsers();
    });

    // Examiner sends a question, emit it only to the examinee in the same room
    socket.on("showQuestion", ({ answer, questionId, roomId }) => {
        if (connectedUsers.examinees[roomId]) {
            io.to(roomId).emit("displayQuestion", { answer, questionId }); // Send question to everyone in the room
            console.log(`Question sent to room: ${roomId}`);
        } else {
            console.log(`No examinee found in room: ${roomId}`);
        }
    });
    // Examinee selects an option, send it only to the examiner in the same room
    socket.on("optionSelected", ({ answer, questionId, roomId }) => {
        if (connectedUsers.examiners[roomId]) {
            // Send the selected option and questionId back to the examiner in the room
            io.to(roomId).emit("updateExaminer", { answer, questionId });
            console.log(
                `Option sent to examiner in room: ${roomId}, questionId: ${questionId}, answer: ${answer}`
            );
        } else {
            console.log(`No examiner found in room: ${roomId}`);
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        // Check if the socket belongs to an examiner or examinee, and remove it from the appropriate list
        for (const roomId in connectedUsers.examiners) {
            if (connectedUsers.examiners[roomId] === socket.id) {
                delete connectedUsers.examiners[roomId];
                socket.leave(roomId);
                console.log(`Examiner disconnected from room: ${roomId}`);
            }
        }
        for (const roomId in connectedUsers.examinees) {
            if (connectedUsers.examinees[roomId] === socket.id) {
                delete connectedUsers.examinees[roomId];
                socket.leave(roomId);
                console.log(`Examinee disconnected from room: ${roomId}`);
            }
        }

        // Log the updated list of connected users
        logConnectedUsers();
    });
});

// Function to log the list of connected examiners and examinees
function logConnectedUsers() {
    console.log("Connected Examiners:", connectedUsers.examiners);
    console.log("Connected Examinees:", connectedUsers.examinees);
}

server.listen(PORT, () => {
    console.log(`Socket.io server listening on port ${PORT}`);
});
