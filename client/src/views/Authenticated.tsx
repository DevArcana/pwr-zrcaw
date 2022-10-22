import { Component } from "solid-js";
import styles from "./Authenticated.module.css";
import UsersList from "../components/UsersList";

const Authenticated: Component = () => {
  return (
    <main class={styles.main}>
      <UsersList/>
    </main>
  );
};

export default Authenticated;