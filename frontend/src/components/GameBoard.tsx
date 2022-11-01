import { Component, createSignal, Match, onCleanup, onMount, Show, Switch } from "solid-js";
import { useSocketContext } from "../context/socket";
import { GameState } from "../../../shared/game";
import styles from "./GameBoard.module.css";

const GameBoard: Component = () => {
  const { getPlayer, socket } = useSocketContext();
  const [ getState, setState ] = createSignal<GameState | null>(null);

  const current_player = () => {
    const state = getState()!;
    return state.current_turn === "x" ? state.player_x : state.player_o;
  };

  const my_sign = () => getState()?.player_o.username === getPlayer()?.username ? "o" : "x";

  onMount(() => {
    socket.emit("game_ready", state => {
      console.log(state)
      setState(state);
    });

    socket.on("game_move", state => setState(state));
  });

  onCleanup(() => {
    socket.off("game_move");
  });

  const makeMove = (cellIndex: number) => {
    socket.emit("game_move", cellIndex, (state) => {
      setState(state);
    });
  };

  return (
    <Show when={getState() !== null} fallback={<div class={styles.loading}>Loading...</div>}>
      <div class={styles.container}>
        <div class={styles.turn_indicator}>
          <Switch>
            <Match when={getState()?.status === "in-progress"}>
              {getPlayer()!.username == current_player().username ? "your turn" : "opponent turn"}
            </Match>
            <Match when={getState()?.status === "tie"}>
              TIE
            </Match>
            <Match when={getState()?.status === "x_won"}>
              <Show when={my_sign() == "x"} fallback={"You lose!"}>
                You win!
              </Show>
            </Match>
            <Match when={getState()?.status === "o_won"}>
              <Show when={my_sign() == "o"} fallback={"You lose!"}>
                You win!
              </Show>
            </Match>
          </Switch>
        </div>
        <div class={styles.board}>
          {getState()?.board.map((cell, index) => <button class={styles.cell} onClick={() => makeMove(index)}>{cell}</button>)}
        </div>
        <Show when={getState()?.status === "in-progress"} fallback={<button class={styles.leave} onClick={() => socket.emit("game_leave")}>Leave</button>}>
          <button class={styles.resign} onClick={() => socket.emit("game_leave")}>Resign</button>
        </Show>
      </div>
    </Show>
  );
};

export default GameBoard;