import { Component, createSignal, JSX } from "solid-js";
import { useAuthContext } from "../contexts/auth";
import styles from "./Unauthenticated.module.css";

const Unauthenticated: Component = () => {
  const { logIn } = useAuthContext();
  const [getUsername, setUsername] = createSignal<string>();

  const onUsernameChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    const target = event.target as HTMLInputElement;
    setUsername(target.value);
  };

  return (
    <main class={styles.main}>
      <form class={styles.form} onSubmit={(e) => {
        e.preventDefault();
        logIn(getUsername()!);
      }}>
        <div>Hello, would you like to log in?</div>
        <input class={styles.input} type="text" onInput={onUsernameChange}/>
        <button type="submit" disabled={!getUsername()}>Yes</button>
      </form>
    </main>
  );
};

export default Unauthenticated;