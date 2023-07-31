import './index.css'
import 'focus-visible/dist/focus-visible'
import 'reflect-metadata'
import './shared/di/container'
import { StrictMode } from 'react'
import './shared/archimedes/archimedes'
import { App } from './app'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
