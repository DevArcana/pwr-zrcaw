import { batch, Component, createEffect, onCleanup, onMount, Show } from "solid-js";
import styles from "./Scoreboard.module.css";
import { useSocketContext } from "../context/socket";
import { Player } from "../../../shared/player";
import { createStore } from "solid-js/store";

const Scoreboard: Component = () => {
  const { socket } = useSocketContext();
  const [ scoreboard, setScoreboard ] = createStore<Player[]>([]);

  onMount(() => {
    socket.emit("scoreboard_enter", (scoreboard) => {
      setScoreboard(scoreboard);
    });

    socket.on("scoreboard_update", (entry) => {
      batch(() => {
        if (scoreboard.some(x => x.username == entry.username)) {
          setScoreboard(s => s.username == entry.username, "score", score => entry.score);
          setScoreboard(s => s.username == entry.username, "status", status => entry.status);
        }
        else {
          setScoreboard([...scoreboard, entry]);
        }
      });
    });
  });

  onCleanup(() => {
    socket.off("scoreboard_update");
    socket.emit("scoreboard_leave");
  });

  return (
    <aside class={styles.aside}>
      <Show when={scoreboard.length > 0}>
        <h6>Scoreboard</h6>
        <ul>
          {[...scoreboard].sort((a, b) => b.score - a.score).map(score => <li>{score.username} - {score.score} - {score.status}</li>)}
        </ul>
      </Show>
    </aside>
  );
};

export default Scoreboard;