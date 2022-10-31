import { GameServer, GameSocket } from "./models/socket";
import { Player } from "../shared/player";
import { Game } from "./game";

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
        const player_a: GameSocket | undefined = lobby.pop();
        const player_b: GameSocket | undefined = lobby.pop();

        if (!player_a || !player_b) {
          if (player_a) {
            lobby.push(player_a);
          }
          if (player_b) {
            lobby.push(player_b);
          }

          socket.data.status = "lobby";
          socket.emit("updated", socket.data as Player);
          console.log(`Player ${socket.data.username} entered the lobby`);
        }
        else {
          player_a.data.status = "in-game";
          player_b.data.status = "in-game";
          player_a.emit("updated", player_a.data as Player);
          player_b.emit("updated", player_b.data as Player);

          console.log(`Player ${player_a.data.username} entered the lobby and found a match with ${player_b.data.username}`);
          const game = new Game(player_a, player_b);
        }
      } else {
        socket.data.status = "lobby";
        socket.emit("updated", socket.data as Player);
        console.log(`Player ${socket.data.username} entered the lobby`);
      }

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