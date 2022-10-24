import { Component, createSignal, Match, Show, Switch } from "solid-js";
import styles from "./Authenticated.module.css";
import UsersList from "../components/UsersList";
import { useAuthContext } from "../contexts/auth";
import GameBoard from "../components/GameBoard";

const Authenticated: Component = () => {
  const { getPlayer, socket } = useAuthContext();
  const [ getSending, setSending ] = createSignal(false);

  const enterLobby = () => {
    if (getSending()) return;
    setSending(true);
    socket.emit("lobby_join", () => {
      setSending(false);
    });
  };

  const leaveLobby = () => {
    if (getSending()) return;
    setSending(true);
    socket.emit("lobby_leave", () => {
      setSending(false);
    });
  };

  return (
    <main class={styles.main}>
      <UsersList/>
      <div class={styles.center}>
        <Switch>
          <Match when={getPlayer()?.status == "idle"}>
            <button disabled={getSending()} onClick={enterLobby}>enter lobby</button>
          </Match>
          <Match when={getPlayer()?.status == "lobby"}>
            <button disabled={getSending()} onClick={leaveLobby}>leave lobby</button>
          </Match>
          <Match when={getPlayer()?.status == "in-game"}>
            <GameBoard/>
          </Match>
        </Switch>
      </div>
    </main>
  );
};

export default Authenticated;