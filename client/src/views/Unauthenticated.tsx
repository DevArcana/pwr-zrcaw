import { Component } from "solid-js";
import { useAuthContext } from "../contexts/auth";

const Unauthenticated: Component = () => {
  const {logIn} = useAuthContext();
  return (<div>
    <div>unauthenticated</div>
    <button onClick={() => logIn("user")}>log in</button>
  </div>);
};

export default Unauthenticated;