import React from 'react'
import ReactDOM from 'react-dom'
import App from 'app/App'
import 'app/i18n'
import { ColorModeScript } from '@chakra-ui/core'
// import 'what-input'

// @ts-ignore
ReactDOM.unstable_createRoot(document.getElementById('root')).render(
  <>
    <ColorModeScript initialColorMode="light" />
    <App />
  </>
)

// Service worker is enabled inside the <ServiceWorkerUpdateBanner /> component!
