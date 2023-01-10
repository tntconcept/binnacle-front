/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom actions that do the login
     * @example cy.login("jdoe", "p4sw0rd")
     */
    login(user: string, password: string): Chainable<Subject>

    /**
     * Custom actions that SKIP the login if the tokens are persisted
     * @example cy.login("jdoe", "p4sw0rd")
     */
    smartLoginTo(
      to: 'binnacle' | 'vacations' | 'settings',
      user?: string,
      password?: string
    ): Chainable<Subject>

    /**
     * Custom actions that reset the back-end database
     */
    resetDatabase(): Chainable<Subject>

    clickOnSelect(selectContent: string, selectRowContent: string): Chainable<any>
  }
}
