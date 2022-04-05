import BinnacleDesktopPO from '../page-objects/BinnacleDesktopPO'
import ActivityFormPO from '../page-objects/ActivityFormPO'
import { getFirstMonday, getPrevMonth, getWeekDay } from '../selectors/shared'

describe('Binnacle Desktop Page', () => {
  const today = new Date()

  beforeEach(() => {
    cy.resetDatabase().then(() => cy.smartLoginTo('binnacle'))

    cy.intercept(/holidays/).as('getHolidays')
    cy.intercept(/activities/).as('getActivities')
    cy.intercept(/working-time/).as('getWorkingTime')
  })

  it('should be able to see holidays', function () {
    // set date
    today.setMonth(3)
    cy.clock(today, ['Date'])

    cy.wait(['@getHolidays', '@getWorkingTime', '@getActivities'])

    // Public holidays
    cy.contains('Public Holiday Testing').should('be.visible')

    // Private holidays
    cy.contains('Vacations').should('be.visible')
  })

  it('should show recent roles list when the new activity is not in the last 30 days', function () {
    cy.intercept('POST', 'api/activities').as('createActivity')
    const today = new Date()
    const dateTwoMonthBefore = new Date()
    dateTwoMonthBefore.setMonth(today.getMonth() - 2)
    const firstMondayTwoMonthBefore = getFirstMonday(dateTwoMonthBefore)
    const month = getPrevMonth(firstMondayTwoMonthBefore.getMonth() + 1)
    const weekName = getWeekDay(firstMondayTwoMonthBefore.getDay())
    const dateToSelect = `${firstMondayTwoMonthBefore.getDate()}, ${weekName} ${month} ${firstMondayTwoMonthBefore.getFullYear()}`

    BinnacleDesktopPO.clickPrevMonth()
    BinnacleDesktopPO.clickPrevMonth()

    cy.findByLabelText(`${dateToSelect}`).click()

    cy.contains('Add role').should('be.visible')
    ActivityFormPO.typeDescription(
      'Creating an activity using recent roles not in the last 30 days'
    ).submit()

    cy.wait('@createActivity').should((xhr) => {
      expect(xhr.response!.statusCode).to.equal(200)
    })
    cy.contains('Creating an activity using recent roles not in the last 30 days')
  })

  it('should show time by year', function () {
    cy.clock(today, ['Date'])
    cy.wait(['@getHolidays', '@getActivities'])
    const date = today.toLocaleDateString('sv-SE') // yyy-MM-dd

    cy.wait('@getWorkingTime').should((xhr) => {
      expect(xhr.request.url).to.include(date)
    })

    cy.get('[data-testid=select]').select('Year')

    cy.get('[data-testid=time_worked_value]').should('be.visible')
    cy.get('[data-testid=time_tracking_hours]').should('be.visible')
  })

  it('should preview the activity', function () {
    // set date
    today.setMonth(3)
    cy.clock(today, ['Date'])

    window.localStorage.setItem(
      'binnacle_settings',
      JSON.stringify({
        isSystemTheme: true,
        autofillHours: true,
        hoursInterval: {
          startWorkingTime: '09:00',
          startLunchBreak: '13:00',
          endLunchBreak: '14:00',
          endWorkingTime: '18:00'
        },
        showDurationInput: false,
        useDecimalTimeFormat: false,
        // changes the showDescription to false...
        showDescription: false
      })
    )
    cy.wait(['@getHolidays', '@getWorkingTime', '@getActivities'])

    cy.contains('14:00 - 18:00 Activity created for end-to-end tests')
      .parent()
      .trigger('mouseenter')

    cy.get('[data-testid=activity_tooltip]')
      .should('be.visible')
      .contains('Activity created for end-to-end tests')
  })

  it('should show the time to work on months with the value equal to 0 when the date is before hiring', function () {
    cy.wait(['@getHolidays', '@getWorkingTime', '@getActivities'])

    cy.get('[data-testid=time_worked_value]').should('exist')
    cy.get('[data-testid=time_tracking_hours]').should('exist')

    BinnacleDesktopPO.clickYearAndMonth('2018', 'Apr')
    cy.wait(['@getActivities'])

    BinnacleDesktopPO.clickPrevMonth()

    BinnacleDesktopPO.checkTimeWorkedValue('0h').checkTimeTrackingHours('0h')
  })
})
