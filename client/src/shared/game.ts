export type Move = "x" | "o"
export type CellState = Move | ""
export type Board = CellState[]

export interface BoardData {
  my_sign: Move
  current_turn: Move
  board: Board
}