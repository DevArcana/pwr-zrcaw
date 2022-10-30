import { GameServer } from "./models/socket";
import { Player } from "../shared/player";

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
  };

  next();
});

io.on("connect", (socket) => {
  socket.emit("connected", socket.data as Player);
});

io.listen(3001);