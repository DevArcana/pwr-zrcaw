import { Component } from "solid-js";
import { useAuthContext } from "../contexts/auth";

const UsersList: Component = () => {
  const {socket} = useAuthContext();
  return (
    <ul>
      nothing here
      {/*getUsers().map(user => <li>{user.self ? <h6>{user.username}</h6> : user.username}</li>)*/}
    </ul>
  );
};

export default UsersList;