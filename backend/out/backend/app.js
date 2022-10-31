"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("./models/socket");
const lobby_1 = require("./lobby");
const io = new socket_1.GameServer({
    cors: {
        origin: "http://localhost:3000",
    },
});
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("invalid username"));
    }
    socket.data = {
        username,
        status: "idle",
    };
    next();
});
io.on("connect", (socket) => {
    console.log(`Player ${socket.data.username} connected`);
    socket.emit("connected", socket.data);
    socket.on("disconnect", (reason) => {
        console.log(`Player ${socket.data.username} disconnected, reason: ${reason}`);
    });
});
(0, lobby_1.setupLobby)(io);
io.listen(3001);
//# sourceMappingURL=app.js.map