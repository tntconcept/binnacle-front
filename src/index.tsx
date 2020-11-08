import React from 'react'
import ReactDOM from 'react-dom'
import App from 'core/App'

// @ts-ignore
// Enable Concurrent Mode
ReactDOM.unstable_createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Service worker is enabled inside the <ServiceWorkerUpdateBanner /> component!
