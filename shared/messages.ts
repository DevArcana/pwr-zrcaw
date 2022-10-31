import { Player } from "./player";
import { GameState } from "./game";

export interface ServerToClientEvents {
  connected: (player: Player) => void;
  updated: (player: Player) => void;

  game_move: (state: GameState) => void;
}

export interface ClientToServerEvents {
  lobby_join: (callback: () => void) => void;
  lobby_leave: (callback: () => void) => void;

  game_ready: (callback: (state: GameState) => void) => void;
  game_move: (cellIndex: number, callback: (state: GameState) => void) => void;
  game_leave: () => void;
}