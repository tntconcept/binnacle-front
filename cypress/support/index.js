// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// A cypress plugin to add a tab command (in beta version)
// - https://github.com/Bkucera/cypress-plugin-tab
// - https://github.com/cypress-io/cypress/issues/299#issuecomment-469792368
import 'cypress-plugin-tab'

import './hooks'
// Import commands.js using ES2015 syntax:
import './commands'

beforeEach(() => {
  // 10 April 2020 16:00:00
  const date = new Date(2020, 4 - 1, 10, 16, 0, 0).getTime()
  cy.clock(date, ['Date'])
})
