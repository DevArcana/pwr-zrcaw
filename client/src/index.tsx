/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/auth";

render(() => <AuthProvider><App/></AuthProvider>, document.getElementById("root") as HTMLElement);
