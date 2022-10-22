import { GameServer, GameSocket } from "./models/socket";
import { Player } from "./models/player";

export const addPlayersFeature = (io: GameServer) => {
  const players: { [username: string]: Player } = {};
  const room = "players";

  const joinPlayer = (username: string) => {
    const player = {
      username,
    };
    players[username] = player;
    io.to(room).emit("players_joined", player);
    console.log(`${username} connected`);
  };

  const leavePlayer = (username: string) => {
    const player = players[username];
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

    joinPlayer(username);

    socket.on("disconnect", async () => {
      leavePlayer(username);
    });

    socket.on("players_start_watching", () => {
      socket.join(room);
      socket.emit("players_list", Object.keys(players).map(username => players[username]));
    });

    socket.on("players_stop_watching", () => {
      socket.leave(room);
    });
  });
};