import type { Component } from "solid-js";
import { useSocketContext } from "./context/socket";
import { Show } from "solid-js";

const App: Component = () => {
  const {getPlayer, signIn, signOut} = useSocketContext();
  return (
    <div>
      <Show when={getPlayer() !== null} fallback={<button onClick={() => signIn("John")}>sign in</button>}>
        <div>{getPlayer()!.username}</div>
        <button onClick={signOut}>sign out</button>
      </Show>
    </div>
  );
};

export default App;
