export type GameStatus = "in-progress" | "x_won" | "o_won" | "tie";

export type GameMove = "x" | "o"
export type GameCell = "" | GameMove
export type GameBoard = GameCell[]

export interface GamePlayer {
  username: string,
  status: "connected" | "disconnected"
};

export interface GameState {
  board: GameBoard;
  status: GameStatus;
  current_turn: GameMove;
  player_x: GamePlayer;
  player_o: GamePlayer;
}