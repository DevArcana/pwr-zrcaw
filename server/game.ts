import { GameSocket } from "./models/socket";
import { updatePlayerStatus } from "./players";
import { Board, BoardData, Move } from "./shared/game";

class Game {
  current_move: Move;
  board: Board;

  x_began: boolean = false;
  o_began: boolean = false;

  constructor(
    public player_x: GameSocket,
    public player_o: GameSocket) {
    this.current_move = "x";
    this.board = [ "", "", "", "", "", "", "", "", "" ];

    player_x.once("game_begin", () => {
      this.x_began = true;

      if (this.o_began) {
        this.setupMoveCallback();
      }

      player_x.emit("game_receive_board", this.getBoardData(player_x));
      player_o.emit("game_receive_board", this.getBoardData(player_o));
    });

    player_o.once("game_begin", () => {
      this.o_began = true;

      if (this.x_began) {
        this.setupMoveCallback();
      }

      player_x.emit("game_receive_board", this.getBoardData(player_x));
      player_o.emit("game_receive_board", this.getBoardData(player_o));
    });
  }

  private getBoardData(player: GameSocket): BoardData {
    return {
      board: this.board,
      current_turn: this.current_move,
      my_sign: player == this.player_x ? "x" : "o",
    };
  }

  private getCurrentPlayer() {
    return this.current_move == "x" ? this.player_x : this.player_o;
  }

  private nextPlayer() {
    this.current_move = this.current_move == "x" ? "o" : "x";
    return this.getCurrentPlayer();
  }

  private makeMove(index: number) {
    if (this.board[index] != "") return false;
    this.board[index] = this.current_move;
    return true;
  }

  private setupMoveCallback() {
    const player = this.getCurrentPlayer();
    player.once("game_make_move", (index, callback) => {
      if (!this.makeMove(index)) return callback(this.getBoardData(player));
      const next = this.nextPlayer();
      callback(this.getBoardData(player));
      next.emit("game_receive_board", this.getBoardData(next));
      this.setupMoveCallback();
    });
  }
}

const games: Game[] = [];

export const startGame = (player_x: GameSocket, player_o: GameSocket) => {
  updatePlayerStatus(player_o.data.username, "in-game");
  updatePlayerStatus(player_x.data.username, "in-game");

  console.log(`${player_x.data.username} [X] vs ${player_o.data.username} [O]`);

  const game = new Game(player_x, player_o);
  games.push(game);
};