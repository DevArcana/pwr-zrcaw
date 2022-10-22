import { batch, createContext, createSignal, onCleanup, onMount, ParentComponent, useContext } from "solid-js";
import { io } from "socket.io-client";

const key = "username";
const URL = "http://localhost:3001";
const socket = io(URL, { autoConnect: false });

const makeContext = () => {
  const [ getUsername, setUsername ] = createSignal<string | undefined>();
  const [ getErrorMessage, setErrorMessage ] = createSignal<string | undefined>();
  const [ getIsAuthenticated, setIsAuthenticated ] = createSignal(false);

  const logIn = (username: string) => {
    if (socket.connected) {
      socket.disconnect();
    }

    socket.auth = { username };
    socket.connect();

    batch(() => {
      setUsername(username);
      window.localStorage.setItem(key, username);
      setIsAuthenticated(false);
      setErrorMessage(undefined);
    });
  };

  const logOut = () => {
    if (socket.connected) {
      socket.disconnect();
    }

    batch(() => {
      setUsername(undefined);
      window.localStorage.removeItem(key);
      setIsAuthenticated(false);
      setErrorMessage(undefined);
    });
  };

  onMount(() => {
    socket.on("connect_error", (err) => {
      batch(() => {
        setUsername(undefined);
        window.localStorage.removeItem(key);
        setIsAuthenticated(false);
        setErrorMessage(err.message);
      });
    });

    socket.on("connect", () => {
      batch(() => {
        setIsAuthenticated(true);
        setErrorMessage(undefined);
      });
    });

    socket.on("disconnect", () => {
      batch(() => {
        setUsername(undefined);
        window.localStorage.removeItem(key);
        setIsAuthenticated(false);
        setErrorMessage("lost connection");
      });

      socket.disconnect();
    });

    const username = window.localStorage.getItem(key);
    if (username) {
      logIn(username);
    }
  });

  onCleanup(() => {
    socket.off("connect_error");
    socket.off("connect");
    socket.off("disconnect");
  });

  return { getUsername, getErrorMessage, getIsAuthenticated, logIn, logOut, socket } as const;
};

type ContextType = ReturnType<typeof makeContext>
const AuthContext = createContext<ContextType>();

export const useAuthContext = () => useContext(AuthContext)!;

export const AuthProvider: ParentComponent = (props) => {
  return (<AuthContext.Provider value={makeContext()}>{props.children}</AuthContext.Provider>);
};