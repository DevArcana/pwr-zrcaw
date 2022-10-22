import type { Component } from "solid-js";

import { useAuthContext } from "./contexts/auth";
import { Show } from "solid-js";
import Unauthenticated from "./views/Unauthenticated";
import Authenticated from "./views/Authenticated";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App: Component = () => {
  const { getAuthState } = useAuthContext();

  return (
    <>
      <Navbar/>
      <Show when={getAuthState().isAuthenticated} fallback={<Unauthenticated/>}>
        <Authenticated/>
      </Show>
      <Footer/>
    </>
  );
};

export default App;
