import { Player } from "./player";
import { BoardData } from "./game";

export interface ServerToClientEvents {
  self: (player: Player) => void;

  players_list: (players: Player[]) => void;
  players_joined: (player: Player) => void;
  players_left: (player: Player) => void;
  players_status_change: (player: Player) => void;

  game_receive_board: (board: BoardData) => void
}

export interface ClientToServerEvents {
  players_start_watching: (callback: () => void) => void;
  players_stop_watching: (callback: () => void) => void;

  lobby_join: (callback: () => void) => void;
  lobby_leave: (callback: () => void) => void;

  game_make_move: (index: number, callback: (board: BoardData) => void) => void;
  game_begin: () => void;
}