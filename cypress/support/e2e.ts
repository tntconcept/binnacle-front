import './commands'
import { injectIntegrationDependencies } from '../../src/test-utils/di/integration-di'

Cypress.on('window:before:load', (win) => {
  cy.stub(win, 'open')
})

injectIntegrationDependencies()
