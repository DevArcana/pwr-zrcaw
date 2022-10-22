import { Server, Socket } from "socket.io";
import { Player } from "./player";

interface ServerToClientEvents {
  players_list: (players: Player[]) => void;
  players_joined: (player: Player) => void;
  players_left: (player: Player) => void;
}

interface ClientToServerEvents {
  players_start_watching: () => void;
  players_stop_watching: () => void;
}

interface InterServerEvents {
}

interface SocketData {
  username: string;
}

export class GameServer extends Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
}

export type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
