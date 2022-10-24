import { Component, onCleanup, onMount } from "solid-js";
import { useAuthContext } from "../contexts/auth";
import styles from "./UsersList.module.css";
import { createStore } from "solid-js/store";
import { Player } from "../shared/player";

const UsersList: Component = () => {
  const { socket } = useAuthContext();
  const [ players, setPlayers ] = createStore<Player[]>([]);

  onMount(() => {
    socket.on("players_list", (data: Player[]) => {
      setPlayers(data);
    });

    socket.on("players_joined", (data: Player) => {
      setPlayers([ ...players, data ]);
    });

    socket.on("players_left", (data: Player) => {
      setPlayers(players.filter(player => player.username != data.username));
    });

    socket.on("players_status_change", (data: Player) => {
      setPlayers(player => player.username == data.username, "status", _ => data.status);
    })

    socket.emit("players_start_watching", () => {});
  });

  onCleanup(() => {
    socket.emit("players_stop_watching", () => {});

    socket.off("players_list");
    socket.off("players_joined");
    socket.off("players_left");
    socket.off("players_status_change")
  });

  return (
    <aside class={styles.aside}>
      <h6>Players List</h6>
      <ul class={styles.ul}>
        {players.map(player => <li class={styles.li}>{player.username} - {player.status}</li>)}
      </ul>
    </aside>
  );
};

export default UsersList;