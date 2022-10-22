import { Component } from "solid-js";
import { css } from "solid-styled";

const Navbar: Component = () => {

  css`
    nav {
      padding: var(--size-2);
    }
  `;

  return (
    <nav>TicTacToe Online</nav>
  );
};

export default Navbar;