import { Component } from "solid-js";
import { useAuthContext } from "../contexts/auth";

const Authenticated: Component = () => {
  const { getAuthState, logOut } = useAuthContext();
  return (
    <div>
      <div>Hello, {getAuthState().username}</div>
      <button onClick={logOut}>log out</button>
    </div>
  );
};

export default Authenticated;