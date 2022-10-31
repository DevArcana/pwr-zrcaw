import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { useSocketContext } from "./context/socket";
import { GameState } from "../../shared/game";

const GameBoard: Component = () => {
  const { getPlayer, socket } = useSocketContext();
  const [ getState, setState ] = createSignal<GameState | null>(null);

  const current_player = () => {
    const state = getState()!;
    return state.current_turn === "x" ? state.player_x : state.player_o;
  };

  onMount(() => {
    socket.emit("game_ready", state => {
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
    <Show when={getState() !== null} fallback={<div>Loading...</div>}>
      <div>
        <div>{getState()?.status}</div>
        <div>{getState()?.current_turn}</div>
        <div>{getPlayer()!.username == current_player().username ? "your turn" : "opponent turn"}</div>
        <div>
          {getState()?.board.map((cell, index) => <button onClick={() => makeMove(index)}>{cell}</button>)}
        </div>
        <div>
          <button onClick={() => socket.emit("game_leave")}>leave</button>
        </div>
      </div>
    </Show>
  );
};

export default GameBoard;