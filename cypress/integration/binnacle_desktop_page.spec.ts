import BinnacleDesktopPO from '../page_objects/BinnacleDesktopPO'

describe('Binnacle Desktop Page', () => {
  beforeEach(() => {
    cy.resetDatabase()
    cy.smartLoginTo('binnacle')

    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/time-balance/).as('getTimeBalance')
    cy.route(/activities/).as('getActivities')

    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities'])
  })

  it('should be able to see holidays', function() {
    // Public holidays
    cy.contains('Public Holiday Testing').should('be.visible')

    // Compensation days
    cy.contains('Compensation Day Testing').should('be.visible')

    // Private holidays
    cy.contains('Vacations').should('be.visible')
  })

  it('should not show recent roles list when the new activity is not in the last 30 days', function() {
    BinnacleDesktopPO.clickPrevMonth()
    BinnacleDesktopPO.checkTimeWorkedValue('4h')
      .checkTimeToWorkValue('176h')
      .checkTimeBalanceValue('-172h')

    cy.contains('29').click()

    cy.contains('Recent roles').should('not.be.visible')

    // Sometimes escape key does not work.
    cy.wait(200)
    cy.get('body').type('{esc}')
    cy.wait(1000)

    cy.contains('24').click()

    cy.contains('Select role').should('be.visible')
  })

  it('should calculate time by year', function() {
    cy.get('[data-testid=select]').select('Year balance')
    BinnacleDesktopPO.checkTimeWorkedValue('12h')
      .checkTimeToWorkValue('648h')
      .checkTimeBalanceValue('-524h')
  })

  it('should show time balance only if the user selects a previous month or current month is selected', function() {
    // Prev month should show select
    BinnacleDesktopPO.clickPrevMonth()
    cy.contains('March').should('be.visible')

    cy.get('[data-testid=select]').should('be.visible')
    cy.contains('Month balance').should('be.visible')

    // Current month should show select
    BinnacleDesktopPO.clickNextMonth()
    cy.contains('April').should('be.visible')

    cy.get('[data-testid=select]').should('be.visible')

    // Next month should hide time balance section
    BinnacleDesktopPO.clickNextMonth()
    cy.contains('May').should('be.visible')

    cy.get('[data-testid=select]').should('not.be.visible')
    cy.contains('Month balance').should('not.be.visible')
  })

  it('should preview the activity', function() {
    cy.contains('14:00 - 18:00 Project: Dashboard').trigger('mouseover')

    cy.get('[data-testid=activity_tooltip]').should('be.visible')
    cy.contains('Activity created for end-to-end tests').should('be.visible')
  })
})
