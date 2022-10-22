import { createContext, createSignal, ParentComponent, useContext } from "solid-js";

const makeContext = () => {
  const [getUsername, setUsername] = createSignal<string>();

  const getAuthState = () => {
    const username = getUsername();
    const isAuthenticated = username !== undefined;
    return {
      username,
      isAuthenticated,
    };
  };

  const logIn = (username: string) => setUsername(username);
  const logOut = () => setUsername(undefined);

  return { getAuthState, logIn, logOut } as const;
};

type ContextType = ReturnType<typeof makeContext>
const AuthContext = createContext<ContextType>();

export const useAuthContext = () => useContext(AuthContext)!;

export const AuthProvider: ParentComponent = (props) => {
  return (<AuthContext.Provider value={makeContext()}>{props.children}</AuthContext.Provider>);
};