"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupLobby = void 0;
const game_1 = require("./game");
let lobby = [];
function setupLobby(io) {
    io.on("connect", (socket) => {
        socket.on("disconnect", () => {
            lobby = lobby.filter(x => x.id !== socket.id);
        });
        socket.on("lobby_join", (callback) => {
            if (!lobby.some(x => x.id === socket.id)) {
                lobby.push(socket);
            }
            if (lobby.length > 1) {
                const player_a = lobby.pop();
                const player_b = lobby.pop();
                if (!player_a || !player_b) {
                    if (player_a) {
                        lobby.push(player_a);
                    }
                    if (player_b) {
                        lobby.push(player_b);
                    }
                    socket.data.status = "lobby";
                    socket.emit("updated", socket.data);
                    console.log(`Player ${socket.data.username} entered the lobby`);
                }
                else {
                    player_a.data.status = "in-game";
                    player_b.data.status = "in-game";
                    player_a.emit("updated", player_a.data);
                    player_b.emit("updated", player_b.data);
                    console.log(`Player ${player_a.data.username} entered the lobby and found a match with ${player_b.data.username}`);
                    const game = new game_1.Game(player_a, player_b);
                }
            }
            else {
                socket.data.status = "lobby";
                socket.emit("updated", socket.data);
                console.log(`Player ${socket.data.username} entered the lobby`);
            }
            callback();
        });
        socket.on("lobby_leave", (callback) => {
            lobby = lobby.filter(x => x.id !== socket.id);
            socket.data.status = "idle";
            socket.emit("updated", socket.data);
            console.log(`Player ${socket.data.username} left the lobby`);
            callback();
        });
    });
}
exports.setupLobby = setupLobby;
//# sourceMappingURL=lobby.js.map