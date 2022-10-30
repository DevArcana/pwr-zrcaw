import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../../shared/messages";
import { createContext, createEffect, createSignal, onCleanup, onMount, ParentComponent, useContext } from "solid-js";
import { Player } from "../../../shared/player";

const URL = "http://localhost:3001";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, { autoConnect: false });

const makeContext = () => {
  const [ getPlayer, setPlayer ] = createSignal<Player | null>(null);
  const [ getAuthError, setAuthError ] = createSignal<string | null>(null);
  const isAuthenticated = () => getPlayer() !== null;

  createEffect(() => {
    const player = getPlayer();
    if (player) {
      setAuthError(null);
    }
  });

  createEffect(() => {
    const error = getAuthError();
    if (error) {
      setPlayer(null);
    }
  });

  onMount(() => {
    socket.on("connected", (player) => {
      setPlayer(player);
    });

    socket.on("disconnect", () => {
      setPlayer(null);
    });
  });

  onCleanup(() => {
    socket.off("connected");
    socket.off("disconnect");
  });

  const signIn = (username: string) => {
    socket.auth = { username };
    socket.connect();
  };

  const signOut = () => {
    if (socket.connected) {
      socket.disconnect();
    }
  };

  return { getPlayer, signIn, signOut };
};

type ContextType = ReturnType<typeof makeContext>
const SocketContext = createContext<ContextType>();

export const useSocketContext = () => useContext(SocketContext)!;

export const AuthProvider: ParentComponent = (props) => {
  return (<SocketContext.Provider value={makeContext()}>{props.children}</SocketContext.Provider>);
};