import { Component, Show } from "solid-js";
import styles from "./Nav.module.css"
import { useSocketContext } from "../context/socket";

const Nav: Component = () => {
  const {getPlayer} = useSocketContext();
  return (
    <nav class={styles.nav}>
      <span>Tic Tac Toe</span>
      <Show when={getPlayer() !== null} fallback={<span></span>}>
        <span>Welcome, {getPlayer()?.username}, score: {getPlayer()?.score}</span>
      </Show>
    </nav>
  );
};

export default Nav;