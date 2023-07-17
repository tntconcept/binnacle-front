import './index.css'
import 'focus-visible/dist/focus-visible'
import 'reflect-metadata'
import './shared/di/container'
import { StrictMode } from 'react'
import './shared/archimedes/archimedes'
import { App } from './app'

import { createRoot } from 'react-dom/client'
import { ToastContainer } from './shared/di/container'

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <StrictMode>
    <App />
    <ToastContainer />
  </StrictMode>
)
