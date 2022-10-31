import { GameServer, GameSocket } from "./models/socket";
import { Player } from "../shared/player";

let lobby: GameSocket[] = [];

export function setupLobby(io: GameServer) {
  io.on("connect", (socket) => {
    socket.on("disconnect", () => {
      lobby = lobby.filter(x => x.id !== socket.id);
    });

    socket.on("lobby_join", (callback) => {
      if (!lobby.some(x => x.id === socket.id)) {
        lobby.push(socket);
      }

      if (lobby.length > 1) {
        socket.data.status = "in-game";
        console.log(`Player ${socket.data.username} entered the lobby and found a match`);
      } else {
        socket.data.status = "lobby";
        console.log(`Player ${socket.data.username} entered the lobby`);
      }

      socket.emit("updated", socket.data as Player);
      callback();
    });

    socket.on("lobby_leave", (callback) => {
      lobby = lobby.filter(x => x.id !== socket.id);

      socket.data.status = "idle";
      socket.emit("updated", socket.data as Player);
      console.log(`Player ${socket.data.username} left the lobby`);

      callback();
    });
  });
}