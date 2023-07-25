import './commands'
import '../../src/test-utils/di/integration-di'

Cypress.on('window:before:load', (win) => {
  cy.stub(win, 'open')
})
