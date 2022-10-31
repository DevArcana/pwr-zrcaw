import type { Component } from "solid-js";
import { createSignal, Match, Show, Switch } from "solid-js";
import { useSocketContext } from "./context/socket";

const App: Component = () => {
  const { getPlayer, signIn, signOut, socket } = useSocketContext();
  const [ getBusy, setBusy ] = createSignal(false);

  const joinLobby = () => {
    setBusy(true);
    socket.emit("lobby_join", () => {
      setBusy(false);
    });
  };

  const leaveLobby = () => {
    setBusy(true);
    socket.emit("lobby_leave", () => {
      setBusy(false);
    });
  };

  return (
    <div>
      <Show when={getPlayer() !== null} fallback={<button onClick={() => signIn("John")}>sign in</button>}>
        <div>{getPlayer()!.username}</div>
        <Switch>
          <Match when={getPlayer()?.status == "idle"}>
            <button onClick={joinLobby}>join lobby</button>
          </Match>
          <Match when={getPlayer()?.status == "lobby"}>
            <button onClick={leaveLobby}>leave lobby</button>
          </Match>
          <Match when={getPlayer()?.status == "in-game"}>
            <div>in-game</div>
          </Match>
        </Switch>
        <button onClick={signOut}>sign out</button>
      </Show>
    </div>
  );
};

export default App;
