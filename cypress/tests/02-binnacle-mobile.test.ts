import { ActivityFormPo } from '../page-objects/activity-form-po'
import { BinnacleMobilePo } from '../page-objects/binnacle-mobile-po'
import { getFirstMonday } from '../selectors/shared'

// Improve tests
// Assert API Calls
// Use testing library to check the cards content with within
describe('Binnacle Mobile Page', () => {
  const today = new Date()

  beforeEach(() => {
    cy.viewport('iphone-xr')
    cy.resetDatabase().then(() => cy.smartLoginTo('binnacle'))

    cy.intercept(/activities/).as('getActivities')
    cy.intercept(/recents/).as('getRecentRoles')
  })

  it('should loads page correctly', () => {
    cy.clock(today, ['Date'])
    const month = today.toLocaleString('default', { month: 'short' })
    const day = today.getDate().toString()

    cy.contains(`${month}, Today`).should('be.visible')

    cy.get('[data-testid=selected_date]').should('be.visible').should('have.text', day)
    cy.get('[data-testid=activity_card]')
      .should('be.visible')
      .parent()
      .contains('Activity created for end-to-end tests')
      .should('be.visible')
  })

  it('should update an activity and update screen', () => {
    cy.clock(today, ['Date'])
    cy.get('[data-testid=activity_card]').eq(0).click()

    ActivityFormPo.toggleBillableField().submit()

    cy.get('[data-testid=activity_card]')
      .should('be.visible')
      .contains('Billable')
      .should('not.exist')
  })

  it('should create an activity and update screen', function () {
    cy.clock(today, ['Date'])
    cy.wait(['@getActivities', '@getRecentRoles'])

    cy.get('[data-testid=add_activity]').click()

    ActivityFormPo.changeStartTime('20:00')
      .changeEndTime('22:00')
      .showSelectRoleSection()
      .selectRole({
        organization: 'Empresa 2',
        project: 'Dashboard',
        projectRole: 'React'
      })
      .typeDescription('Description written by Cypress')
      .submit()

    cy.wait('@getActivities')

    cy.get('[data-testid=activity_card]')
      .should('have.length', 2)
      .eq(1)
      .should('be.visible')
      .contains('Billable')
      .should('be.visible')
      .parent()
      .contains('20:00 - 22:00 (2h)')
      .should('be.visible')
  })

  it('should create on other day correctly', function () {
    cy.clock(today, ['Date'])
    const dateToChange = new Date()
    const nextWeek = new Date(dateToChange.setDate(today.getDate() + 7))
    const month = nextWeek.toLocaleString('default', { month: 'short' })

    BinnacleMobilePo.swipeNextWeek()

    cy.contains(`${month}, Next Monday`)
      .get('[data-testid=selected_date]')
      .get('[data-testid=add_activity]')
      .click()

    ActivityFormPo.changeStartTime('18:30')
      .changeEndTime('19:00')
      .showSelectRoleSection()
      .selectRole({
        organization: 'Empresa 2',
        project: 'Dashboard',
        projectRole: 'React'
      })
      .typeDescription(`Activity created on ${month}`)
      .submit()

    cy.contains(`${month}, Next Monday`)
      .get('[data-testid=selected_date]')
      .get('[data-testid=activity_card]')
      .should('be.visible')
      .contains(`Activity created on ${month}`)
  })

  it('should show total time of activities by date', function () {
    cy.clock(today, ['Date'])
    cy.get('[data-testid=activities_time]').contains('1h')
  })

  it('should be able to see public holidays', function () {
    // set date
    today.setMonth(3)
    const firstMondayOfApr = getFirstMonday(today)
    today.setDate(firstMondayOfApr.getDate() + 7)
    cy.clock(today, ['Date'])

    cy.get('[style="transform: translateX(0%) translateZ(0px);"] > :nth-child(1)').click()
    cy.contains('Public Holiday Testing').should('be.visible')
  })

  it('should be able to see vacations', function () {
    // set date
    today.setMonth(3)
    const firstMondayOfApr = getFirstMonday(today)
    today.setDate(firstMondayOfApr.getDate() + 1)
    cy.clock(today, ['Date'])

    cy.contains('[data-testid=activities_time]', 'Vacations').should('be.visible')
  })
})
