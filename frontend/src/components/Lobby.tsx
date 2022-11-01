import { Component, createSignal, Match, Show, Switch } from "solid-js";

import styles from "./Lobby.module.css";
import { useSocketContext } from "../context/socket";

const Lobby: Component = () => {
  const {socket, getPlayer} = useSocketContext();
  const [getBusy, setBusy] = createSignal(false);

  const joinLobby = () => {
    if (getBusy()) {
      return;
    }

    setBusy(true);
    socket.emit("lobby_join", () => {
      setBusy(false);
    })
  }

  const leaveLobby = () => {
    if (getBusy()) {
      return;
    }

    setBusy(true);
    socket.emit("lobby_leave", () => {
      setBusy(false);
    })
  }

  return (
    <div class={styles.container}>
      <Switch>
        <Match when={getPlayer()?.status === "lobby"}>
          <button onClick={leaveLobby} disabled={getBusy()} class={styles.button}>Leave Lobby</button>
        </Match>
        <Match when={getPlayer()?.status === "idle"}>
          <button onClick={joinLobby} disabled={getBusy()} class={styles.button}>Join Lobby</button>
        </Match>
      </Switch>
    </div>
  );
};

export default Lobby;