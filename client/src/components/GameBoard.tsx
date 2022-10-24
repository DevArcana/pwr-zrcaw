import { batch, Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { useAuthContext } from "../contexts/auth";
import styles from "./GameBoard.module.css";
import { Board, CellState, Move } from "../shared/game";

const GameBoard: Component = () => {
  const { socket } = useAuthContext();
  const [ getBoard, setBoard ] = createSignal<Board>([ "", "", "", "", "", "", "", "", "" ]);
  const [ getCurrentMove, setCurrentMove ] = createSignal<Move>("x");
  const [ getMySign, setMySign ] = createSignal<CellState>("");

  const canMove = () => {
    const current_move = getCurrentMove();
    const sign = getMySign();

    return sign === current_move;
  };

  onMount(() => {
    socket.on("game_receive_board", (board) => {
      batch(() => {
        setBoard(board.board);
        setMySign(board.my_sign);
        setCurrentMove(board.current_turn);
      });
    });

    socket.emit("game_begin");
  });

  onCleanup(() => {
    socket.off("game_receive_board");
  });

  const makeMove = (index: number) => {
    if (canMove()) {
      socket.emit("game_make_move", index, (board) => {
        batch(() => {
          setBoard(board.board);
          setMySign(board.my_sign);
          setCurrentMove(board.current_turn);
        });
      });
    }
  };

  return (
    <Show when={getMySign() != ""} fallback={<div class={styles.loading}>Loading...</div>}>
      <div>
        <div><Show when={canMove()} fallback={"Opponent's turn"}>Your turn</Show></div>
        <div class={styles.board}>
          {getBoard().map((cell, index) => <div class={styles.cell} onClick={() => makeMove(index)}>{cell}</div>)}
        </div>
      </div>
    </Show>
  );
};

export default GameBoard;