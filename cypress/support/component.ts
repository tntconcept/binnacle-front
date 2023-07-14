import './../../src/test-utils/di/integration-di'
import './../../src/shared/archimedes/archimedes'
import './commands'
import { mount } from 'cypress/react18'
import '../../src/index.css'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add('mount', mount)
