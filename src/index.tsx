import React from 'react'
import ReactDOM from 'react-dom'
import App from 'app/App'
import 'app/i18n'
import 'what-input'

if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./test-utils/mock-service-worker/browser')
  worker.start({
    serviceWorker: {
      url: 'http://localhost:3000/mockServiceWorker.js'
    },
    onUnhandledRequest: 'warn',
    waitUntilReady: true
  })
}

// @ts-ignore
ReactDOM.unstable_createRoot(document.getElementById('root')).render(<App />)

// Service worker is enabled inside the <ServiceWorkerUpdateBanner /> component!
