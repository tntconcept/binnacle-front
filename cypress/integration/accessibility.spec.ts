import SettingsPO from '../page_objects/SettingsPO'

// TODO: Investigate a way to navigate on the binnacle calendar using the keyboard arrows.

describe('Accessibility tests', () => {
  it('should login using the keyboard', function() {
    cy.visit('/')
    cy.contains('Welcome')

    cy.get('body').tab()
    cy.focused().should('have.attr', 'name', 'username')

    cy.focused()
      .type('testuser')
      .tab()

    cy.focused().should('have.attr', 'name', 'password')
    cy.focused()
      .type('holahola')
      .type('{enter}')
  })

  it('should skip to content correctly', function() {
    cy.smartLoginTo('binnacle')
    cy.contains('April')

    cy.get('body').tab()

    // type('{enter}') does not work
    cy.focused()
      .contains('Skip to content')
      .should('have.attr', 'href', '#calendar-content')
      .click()

    cy.url().should('include', '#calendar-content')
  })

  it('should navigate to today using keyboard', function() {
    cy.smartLoginTo('binnacle')
    cy.contains('April')

    cy.get('[data-testid=prev_month_button]')
      .should('have.attr', 'aria-label', 'Previous month, March 2020')
      .tab()

    cy.focused()
      .should('have.attr', 'aria-label', 'Next month, May 2020')
      .tab()

    cy.focused().should('have.attr', 'aria-label', '10, Friday April 2020, 8 Hours')
  })
})
