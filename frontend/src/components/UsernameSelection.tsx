import { Component, createSignal, Show } from "solid-js";
import styles from "./UsernameSelection.module.css";
import { useSocketContext } from "../context/socket";

const UsernameSelection: Component = () => {
  const { signIn } = useSocketContext();
  const [ getUsername, setUsername ] = createSignal("");

  const onInput = (inputEvent: InputEvent) => {
    const target = inputEvent.target as HTMLInputElement;
    const username = target.value;
    setUsername(username);
  };

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const username = getUsername();
    if (username) {
      signIn(username);
    }
  };

  return (
    <form onSubmit={onSubmit} class={styles.container}>
      <input type="text" onInput={onInput} class={styles.input}/>
      <button class={styles.button} disabled={getUsername() == ""}>
        <Show when={getUsername() != ""} fallback={"Who am I?"}>
          <span>I am {getUsername()}</span>
        </Show>
      </button>
    </form>
  );
};

export default UsernameSelection;