import 'index.css'
import 'focus-visible/dist/focus-visible'
import 'reflect-metadata'
import 'shared/di/container'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { configure } from 'mobx'
import 'shared/archimedes/archimedes'
import { App } from 'app'

configure({
  enforceActions: 'always' // don't allow state modifications outside actions
  // computedRequiresReaction: true,
  // reactionRequiresObservable: true,
  // observableRequiresReaction: true,
  // disableErrorBoundaries: false
})

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)

// Service worker is enabled inside the <ServiceWorkerUpdateBanner /> component!
