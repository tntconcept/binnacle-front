import './commands'
import { mount } from 'cypress/react'
import '../../src/index.css'
import '../../src/test-utils/di/integration-di'
import '../../src/shared/archimedes/archimedes'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

//TODO Update mount to be able to wrap component with MemoryRouter or TntChakraProvider
Cypress.Commands.add('mount', mount)

// Example use:
// cy.mount(<MyComponent />)
