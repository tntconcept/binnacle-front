import { TokenService } from '../../src/services/TokenService'
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// import 'cypress-file-upload'
import '@testing-library/cypress/add-commands'
import 'cypress-jest-adapter'

Cypress.Commands.add('login', (username = 'testuser', password = 'holahola') => {
  cy.server()
  cy.route('POST', '/oauth/token').as('getTokens')

  cy.visit('/')

  cy.get(`[data-testid=username]`).type('testuser')
  cy.get(`[data-testid=password]`).type('holahola')
  cy.get(`[data-testid=login_button]`).click()

  cy.wait('@getTokens')
})

Cypress.Commands.add(
  'smartLoginTo',
  (navigateTo, username = 'testuser', password = 'holahola') => {
    // Token is saved on memory or was not persited yet
    if (!TokenService.tokensArePersisted()) {
      cy.login(username, password)

      switch (navigateTo) {
        case 'binnacle': {
          break
        }
        case 'settings': {
          cy.contains(/settings/i).click()
          break
        }
        case 'vacation': {
          cy.contains(/vacation/i).click()
          break
        }
      }
    } else {
      switch (navigateTo) {
        case 'binnacle': {
          cy.visit('/binnacle')
          break
        }
        case 'settings': {
          cy.visit('/settings')
          break
        }
        case 'vacation': {
          cy.visit('/vacation')
          break
        }
      }
    }
  }
)

Cypress.Commands.add('resetDatabase', () => {
  cy.request('GET', 'http://localhost:8080/db/seed')
})
