import { Component } from "solid-js";
import styles from "./Authenticated.module.css";
import UsersList from "../components/UsersList";

const Authenticated: Component = () => {
  return (
    <main class={styles.main}>
      <UsersList/>
      <div></div>
    </main>
  );
};

export default Authenticated;