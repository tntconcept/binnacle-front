import 'index.css'
import 'focus-visible/dist/focus-visible'
import 'reflect-metadata'
import 'shared/di/container'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import 'shared/archimedes/archimedes'
import { App } from 'app'

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
