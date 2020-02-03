import React from "react"
import ReactDOM from "react-dom"
import "index.css"
import "i18n"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import {DebugEngine, Provider as StyletronProvider} from "styletron-react"
import {Client as Styletron} from "styletron-engine-atomic"
import {BrowserRouter} from "react-router-dom"

const debug =
  // @ts-ignore
  process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();

// 1. Create a client engine instance
const engine = new Styletron();

// 2. Provide the engine to the app
ReactDOM.render(
  <StyletronProvider
    value={engine}
    debug={debug}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StyletronProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
