import { Player } from "./player";

export interface ServerToClientEvents {
  connected: (player: Player) => void;
  updated: (player: Player) => void;
}

export interface ClientToServerEvents {
  lobby_join: (callback: () => void) => void;
  lobby_leave: (callback: () => void) => void;
}