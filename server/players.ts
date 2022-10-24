import { GameServer, GameSocket } from "./models/socket";
import { Player, PlayerStatus } from "./shared/player";

const players: { [username: string]: { player: Player, socket: GameSocket } } = {};
const room = "players";
let io: GameServer;

export const addPlayersFeature = (server: GameServer) => {
  io = server;

  const joinPlayer = (socket: GameSocket, username: string) => {
    const player: Player = {
      username,
      status: "idle",
    };

    players[username] = { player, socket };
    io.to(room).emit("players_joined", player);
    console.log(`${username} connected`);
  };

  const leavePlayer = (username: string) => {
    const { player } = players[username];
    delete players[username];
    io.to(room).emit("players_left", player);
    console.log(`${username} disconnected`);
  };

  // verify username is unique
  io.use((socket, next) => {
    const username = socket.data.username;

    if (username in players) {
      return next(new Error("player already exists"));
    }

    next();
  });

  io.on("connection", (socket: GameSocket) => {
    const username = socket.data.username;

    joinPlayer(socket, username);

    socket.emit("self", players[username].player)

    socket.on("disconnect", async () => {
      leavePlayer(username);
    });

    socket.on("players_start_watching", (callback) => {
      socket.join(room);
      socket.emit("players_list", Object.keys(players).map(username => players[username].player));
      callback();
    });

    socket.on("players_stop_watching", (callback) => {
      socket.leave(room);
      callback();
    });
  });
};

export const updatePlayerStatus = (username: string, status: PlayerStatus) => {
  const { player, socket } = players[username];
  player.status = status;
  socket.emit("self", player);
  io.to(room).emit("players_status_change", player);
};