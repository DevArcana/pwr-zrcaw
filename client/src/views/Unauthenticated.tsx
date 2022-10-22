import { Component, createSignal, JSX, Show } from "solid-js";
import { useAuthContext } from "../contexts/auth";
import styles from "./Unauthenticated.module.css";

const Unauthenticated: Component = () => {
  const { getErrorMessage, logIn } = useAuthContext();
  const [ getUsername, setUsername ] = createSignal<string>();

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
        <Show when={getErrorMessage() !== undefined} fallback={<small class={styles.small}>&zwnj;</small>}>
          <small class={styles.small}>{getErrorMessage()}</small>
        </Show>
      </form>
    </main>
  );
};

export default Unauthenticated;