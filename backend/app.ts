import { GameServer } from "./models/socket";
import { Player } from "../shared/player";
import { setupLobby } from "./lobby";
import { AppDataSource } from "./data-source";
import { Scoreboard } from "./entity/Scoreboard";

AppDataSource.initialize().then(async () => {
  const io = new GameServer({
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.use(async (socket, next) => {
    const username = socket.handshake.auth.username;

    if (!username) {
      return next(new Error("invalid username"));
    }

    let score: Scoreboard;
    const scoreboard = await Scoreboard.findBy({username})
    if (scoreboard.length == 0) {
      score = new Scoreboard()
      score.username = username;
      score.score = 0;
      await score.save();
    }
    else {
      score = scoreboard[0];
    }

    socket.data = {
      username,
      status: "idle",
      score: score.score
    };

    next();
  });

  io.on("connect", (socket) => {
    console.log(`Player ${socket.data.username} connected`);
    socket.emit("connected", socket.data as Player);
    socket.on("disconnect", (reason) => {
      console.log(`Player ${socket.data.username} disconnected, reason: ${reason}`);
    });
  });

  setupLobby(io);

  await io.listen(3001);
}).catch(error => console.log(error));