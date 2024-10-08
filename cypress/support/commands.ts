import 'cypress-file-upload'
import '@testing-library/cypress/add-commands'
import 'cypress-jest-adapter'

Cypress.Commands.add('login', (username = 'admin', password = 'adminadmin') => {
  cy.intercept('POST', '/oauth/token').as('getTokens')

  cy.visit('/')

  cy.findByLabelText(/username/i).type(username, { delay: 40 })
  cy.findByLabelText(/password/i).type(password + '{enter}', { delay: 40 })

  cy.wait('@getTokens')
})

Cypress.Commands.add('clickOnSelect', (selectContent, selectRowContent) => {
  cy.get('.chakra-input css-stmgyg')
    .contains(selectContent)
    .closest('.chakra-input css-stmgyg')
    .as('SelectToClick')
    .click({ force: true })
  //cy.wait(500)
  // Reintento
  cy.get('body').then(($body) => {
    if ($body.find('.css-1xbzxyq').length === 0) {
      cy.get('@SelectToClick').click({ force: true })
      //cy.wait(500)
    }
  })
  cy.get('.css-1xbzxyq').contains(selectRowContent).click({ force: true })
  // cy.wait(500)
  // Quitamos dropdown
  cy.get('body').then(($body) => {
    if ($body.find('.css-1xbzxyq').length > 0) {
      cy.get('@SelectToClick').click({ force: true })
      // cy.wait(500)
    }
  })
})

Cypress.Commands.add('smartLoginTo', (navigateTo, username = 'admin', password = 'adminadmin') => {
  // Token is saved on memory or was not persited yet
  cy.login(username, password)
  switch (navigateTo) {
    case 'binnacle': {
      break
    }
    case 'settings': {
      cy.contains(/settings/i).click()
      break
    }
    case 'vacations': {
      cy.contains('Vacaciones').click()
      break
    }
  }
})

Cypress.Commands.add('resetDatabase', () => {
  cy.request('GET', 'http://localhost:8080/db/seed')
})
