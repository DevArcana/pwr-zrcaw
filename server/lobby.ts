import { GameServer, GameSocket } from "./models/socket";
import { updatePlayerStatus } from "./players";
import { startGame } from "./game";

let io: GameServer;
const lobby: { [username: string]: GameSocket } = {};

const matchmaking = (socket: GameSocket) => {
  const players = Object.keys(lobby);

  if (players.length < 2) return;

  const username = socket.data.username;
  const others = players.filter(key => key != username);
  const candidate = others[Math.floor(Math.random() * others.length)];

  const [ player_x, player_o ] = Math.random() % 2 == 0
    ? [ lobby[username], lobby[candidate] ]
    : [ lobby[candidate], lobby[username] ];

  startGame(player_x, player_o);

  delete lobby[username];
  delete lobby[candidate];
};

const joinLobby = (socket: GameSocket) => {
  const username = socket.data.username;
  if (username in lobby) return;
  lobby[username] = socket;
  updatePlayerStatus(socket.data.username, "lobby");
  matchmaking(socket);
};

const leaveLobby = (socket: GameSocket) => {
  const username = socket.data.username;
  if (!(username in lobby)) return;
  delete lobby[username];
  updatePlayerStatus(socket.data.username, "idle");
};

export const addLobbyFeature = (server: GameServer) => {
  io = server;

  io.on("connection", (socket: GameSocket) => {
    socket.on("lobby_join", (callback) => {
      joinLobby(socket);
      callback();
    });

    socket.on("lobby_leave", (callback) => {
      leaveLobby(socket);
      callback();
    });
  });
};