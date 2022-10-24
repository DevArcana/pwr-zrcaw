import { GameServer } from "./models/socket";
import { addPlayersFeature } from "./players";
import { addLobbyFeature } from "./lobby";

const io = new GameServer({
  cors: {
    origin: "http://localhost:3000",
  },
});

// validate username
io.use((socket, next) => {
  const username = socket.handshake.auth.username;

  if (!username) {
    return next(new Error("invalid username"));
  }

  socket.data.username = username;

  next();
});

addPlayersFeature(io);
addLobbyFeature(io);

io.listen(3001);