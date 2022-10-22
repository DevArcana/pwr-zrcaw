import type { Component } from "solid-js";

import { useAuthContext } from "./contexts/auth";
import { Show } from "solid-js";
import Unauthenticated from "./views/Unauthenticated";
import Authenticated from "./views/Authenticated";

const App: Component = () => {
  const { getAuthState } = useAuthContext();
  return (
    <Show when={getAuthState().isAuthenticated} fallback={<Unauthenticated/>}>
      <Authenticated/>
    </Show>
  );
};

export default App;
