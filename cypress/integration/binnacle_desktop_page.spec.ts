import ActivityFormPO from '../page_objects/ActivityFormPO'
import BinnacleDesktopPO from '../page_objects/BinnacleDesktopPO'

describe('Binnacle Desktop Page', () => {
  beforeEach(() => {
    cy.resetDatabase()
    cy.smartLoginTo('binnacle')

    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/timeBalance/).as('getTimeBalance')
    cy.route(/activities/).as('getActivities')

    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities'])
  })

  it('should update time stats when an activity is created', () => {
    cy.server()
    cy.route('POST', 'api/activities').as('createActivity')

    BinnacleDesktopPO.openTodayActivityForm()

    ActivityFormPO.changeStartTime('14:00')
      .changeEndTime('18:00')
      .showSelectRoleSection()
      .selectRole({
        organization: 'Empresa 2',
        project: 'Dashboard',
        projectRole: 'React'
      })
      .typeDescription('Description written by Cypress')
      .submit()

    cy.wait(['@createActivity', '@getTimeBalance', '@getActivities'])

    BinnacleDesktopPO.checkTodayHoursQuantity('8h')
      .checkTimeWorkedValue('12h')
      .checkTimeToWorkValue('160h')
      .checkTimeBalanceValue('-44h')

    cy.contains('14:00 - 18:00 Project: Dashboard').should('be.visible')
  })

  it('should update time stats when an activity is deleted', function() {
    cy.server()
    cy.route('DELETE', 'api/activities/*').as('deleteActivity')

    BinnacleDesktopPO.getPreparedActivity().click()

    ActivityFormPO.remove()

    cy.wait(['@deleteActivity', '@getTimeBalance', '@getActivities'])

    BinnacleDesktopPO.checkTimeWorkedValue('4h')
      .checkTimeToWorkValue('160h')
      .checkTimeBalanceValue('-52h')
  })

  it('should update time stats when an activity is edited', function() {
    cy.server()
    cy.route('PUT', 'api/activities').as('updateActivity')

    BinnacleDesktopPO.getPreparedActivity().click()

    ActivityFormPO.changeEndTime('16:00')
      .toggleBillableField()
      .typeDescription('Editing an activity')
      .submit()

    cy.wait(['@updateActivity', '@getTimeBalance', '@getActivities'])

    cy.contains('09:00 - 16:00 Project: Dashboard').should('be.visible')

    BinnacleDesktopPO.checkTimeWorkedValue('11h')
      .checkTimeToWorkValue('160h')
      .checkTimeBalanceValue('-45h')
      .checkTodayHoursQuantity('7h')
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

    // I don't know why sometimes escape key does not work.
    cy.wait(200)
    cy.get('body').type('{esc}')

    cy.contains('24').click()

    cy.contains('Select role').should('be.visible')
  })

  it('should calculate time by year', function() {
    cy.get('[data-testid=select]').select('Year balance')
    BinnacleDesktopPO.checkTimeWorkedValue('12h')
      .checkTimeToWorkValue('656h')
      .checkTimeBalanceValue('-540h')
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
    cy.contains('09:30 - 13:30 Project: Dashboard').trigger('mouseover')

    cy.get('[data-testid=activity_tooltip]').should('be.visible')
    cy.contains('Activity created for end-to-end tests').should('be.visible')
  })
})
