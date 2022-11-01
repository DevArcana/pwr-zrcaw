import { Component, Show } from "solid-js";

import styles from "./Main.module.css";
import { useSocketContext } from "../context/socket";
import UsernameSelection from "./UsernameSelection";
import Lobby from "./Lobby";
import GameBoard from "./GameBoard";

const Main: Component = () => {
  const { getPlayer } = useSocketContext();
  return (
    <main class={styles.main}>
      <Show when={getPlayer() !== null} fallback={<UsernameSelection/>}>
        <Show when={getPlayer()?.status === "in-game"} fallback={<Lobby/>}>
          <GameBoard/>
        </Show>
      </Show>
    </main>
  );
};

export default Main;