import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared/messages";
import { Player } from "../../shared/player";

export interface InterServerEvents {
}

export interface SocketData extends Player {

}

export class GameServer extends Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
}

export class GameSocket extends Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
}

