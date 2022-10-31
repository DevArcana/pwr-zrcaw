import { GameServer } from "./models/socket";
import { Player } from "../shared/player";
import { setupLobby } from "./lobby";

const io = new GameServer({
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
  socket.emit("connected", socket.data as Player);
  socket.on("disconnect", (reason) => {
    console.log(`Player ${socket.data.username} disconnected, reason: ${reason}`);
  });
});

setupLobby(io);

io.listen(3001);