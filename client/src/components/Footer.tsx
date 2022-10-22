import { Component } from "solid-js";
import styles from "./Footer.module.css";

const Footer: Component = () => {
  return (
    <footer class={styles.footer}>
      <div class={styles.div}>
        <p class={styles.p}>&copy; Copyright 2022 Piotr Krzystanek</p>
        <small class={styles.small}>MIT license, you can do you what you want, I don't care.</small>
      </div>
    </footer>
  );
};

export default Footer;