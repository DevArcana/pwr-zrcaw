import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../shared/messages";

export interface InterServerEvents {
}

export interface SocketData {
  username: string;
}

export class GameServer extends Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
}

export type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
