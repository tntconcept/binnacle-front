import 'shared/global.css'
import 'focus-visible/dist/focus-visible'
import 'reflect-metadata'
import 'shared/data-access/ioc-container/ioc-container'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from 'shared/App'
import { configure } from 'mobx'

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
