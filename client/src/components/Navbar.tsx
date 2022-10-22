import { Component, Show } from "solid-js";
import { useAuthContext } from "../contexts/auth";

import styles from "./Navbar.module.css";

const Navbar: Component = () => {

  const { getAuthState, logOut } = useAuthContext();

  return (
    <nav class={styles.nav}>
      <span>TicTacToe Online</span>
      <Show when={getAuthState().isAuthenticated}>
        <span>Welcome, {getAuthState().username}! <a href="#" onClick={logOut}>Log out here.</a></span>
      </Show>
    </nav>
  );
};

export default Navbar;