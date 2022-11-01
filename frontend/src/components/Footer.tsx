import { Component } from "solid-js";
import styles from "./Footer.module.css"

const Footer: Component = () => {
  return (<footer class={styles.footer}><small>&copy; Copyright 2022, Piotr Krzystanek</small></footer>);
};

export default Footer;