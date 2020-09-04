/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command that do the login
     * @example cy.login("jdoe", "p4sw0rd")
     */
    login(user: string, password: string): Chainable<Subject>

    /**
     * Custom command that SKIP the login if the tokens are persisted
     * @example cy.login("jdoe", "p4sw0rd")
     */
    smartLoginTo(
      to: 'binnacle' | 'vacations' | 'settings',
      user?: string,
      password?: string
    ): Chainable<Subject>

    /**
     * Custom command that reset the back-end database
     */
    resetDatabase(): Chainable<Subject>
  }
}
