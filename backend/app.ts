import * as dotenv from 'dotenv'
dotenv.config()

import { GameServer } from "./models/socket";
import { Player } from "../shared/player";
import { setupLobby } from "./lobby";
import { AppDataSource } from "./data-source";
import { Scoreboard } from "./entity/Scoreboard";

export const io = new GameServer({
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

AppDataSource.initialize().then(async () => {
  io.use(async (socket, next) => {
    const username = socket.handshake.auth.username;

    if (!username) {
      return next(new Error("invalid username"));
    }

    let score: Scoreboard;
    const scoreboard = await Scoreboard.findBy({ username });
    if (scoreboard.length == 0) {
      score = new Scoreboard();
      score.username = username;
      score.score = 0;
      await score.save();
    } else {
      score = scoreboard[0];
    }

    socket.data = {
      username,
      status: "idle",
      score: score.score,
    };

    next();
  });

  io.on("connect", (socket) => {
    console.log(`Player ${socket.data.username} connected`);
    io.to("scoreboard").emit("scoreboard_update", socket.data as Player);
    socket.emit("connected", socket.data as Player);
    socket.on("disconnect", (reason) => {
      console.log(`Player ${socket.data.username} disconnected, reason: ${reason}`);
      io.to("scoreboard").emit("scoreboard_update", socket.data as Player);
    });
    socket.on("scoreboard_enter", async (callback) => {
      socket.join("scoreboard");
      const scores = await Scoreboard.find();
      const players = Array.from(io.sockets.sockets.values());
      const all = scores.map<Player>(score => {
        const player = players.find(p => p.data.username == score.username);
        if (!player) {
          return {
            username: score.username,
            score: score.score,
            status: "disconnected",
          };
        } else {
          return player.data as Player;
        }
      });
      callback(all);
    });

    socket.on("scoreboard_leave", () => {
      socket.leave("scoreboard");
    });
  });

  setupLobby(io);

  await io.listen(3001);
}).catch(error => console.log(error));