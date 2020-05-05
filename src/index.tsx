import React from "react"
import ReactDOM from "react-dom"
import "i18n"
import * as serviceWorker from "./serviceWorker"
import {BrowserRouter} from "react-router-dom"
import "index.css"
import "css-variables.css"
import 'what-input'
import App from "App"

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
