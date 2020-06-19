import React from 'react'
import ReactDOM from 'react-dom'
import App from 'app'
import 'i18n'
import 'what-input'

// @ts-ignore
ReactDOM.unstable_createRoot(document.getElementById('root')).render(<App />)

// Service worker is enabled inside the <App /> component!
