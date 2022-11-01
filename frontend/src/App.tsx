import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { useSocketContext } from "./context/socket";
import Nav from "./components/Nav";
import Main from "./components/Main";
import Footer from "./components/Footer";
import Scoreboard from "./components/Scoreboard";

const App: Component = () => {
  const { getPlayer, signIn, signOut, socket } = useSocketContext();
  const [ getBusy, setBusy ] = createSignal(false);

  const joinLobby = () => {
    if (getBusy()) return;
    setBusy(true);
    socket.emit("lobby_join", () => {
      setBusy(false);
    });
  };

  const leaveLobby = () => {
    if (getBusy()) return;
    setBusy(true);
    socket.emit("lobby_leave", () => {
      setBusy(false);
    });
  };

  return (
    <>
      <Nav/>
      <Scoreboard/>
      <Main/>
      <Footer/>
    </>
    // <div>
    //   <Show when={getPlayer() !== null} fallback={<button onClick={() => signIn("John")}>sign in</button>}>
    //     <div>{getPlayer()!.username}</div>
    //     <Switch>
    //       <Match when={getPlayer()?.status == "idle"}>
    //         <button onClick={joinLobby} disabled={getBusy()}>join lobby</button>
    //       </Match>
    //       <Match when={getPlayer()?.status == "lobby"}>
    //         <button onClick={leaveLobby} disabled={getBusy()}>leave lobby</button>
    //       </Match>
    //       <Match when={getPlayer()?.status == "in-game"}>
    //         <GameBoard/>
    //       </Match>
    //     </Switch>
    //     <button onClick={signOut}>sign out</button>
    //   </Show>
    // </div>
  );
};

export default App;
