import React from 'react'
import ReactDOM from 'react-dom'
import App from 'core/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

// @ts-ignore
// Enable Concurrent Mode
ReactDOM.unstable_createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()
