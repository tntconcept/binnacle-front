import './commands'

Cypress.on('window:before:load', (win) => {
  cy.stub(win, 'open')
})
