import { Component, Show } from "solid-js";

import styles from "./Main.module.css";
import { useSocketContext } from "../context/socket";
import UsernameSelection from "./UsernameSelection";

const Main: Component = () => {
  const { getPlayer } = useSocketContext();
  return (
    <main class={styles.main}>
      <Show when={getPlayer() !== null} fallback={<UsernameSelection/>}>
        <div>lobby</div>
      </Show>
    </main>
  );
};

export default Main;