import { Player } from "./player";

export interface ServerToClientEvents {
  self: (player: Player) => void

  players_list: (players: Player[]) => void;
  players_joined: (player: Player) => void;
  players_left: (player: Player) => void;
  players_status_change: (player: Player) => void;
}

export interface ClientToServerEvents {
  players_start_watching: (callback: () => void) => void;
  players_stop_watching: (callback: () => void) => void;

  lobby_join: (callback: () => void) => void;
  lobby_leave: (callback: () => void) => void;
}