import BinnacleDesktopPO from '../page-objects/BinnacleDesktopPO'

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
    // TODO: after merged the new roles behavior.
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

    cy.get('[data-testid=activity_tooltip]').should('be.visible')
    cy.contains('Activity created for end-to-end tests').should('be.visible')
  })

  it('should show the time to work on months with the value equal to 0 when the date is before hiring', function () {
    cy.wait(['@getHolidays', '@getWorkingTime', '@getActivities'])

    cy.get('[data-testid=time_worked_value]').should('exist')
    cy.get('[data-testid=time_tracking_hours]').should('exist')

    BinnacleDesktopPO.clickYearAndMonth('2018', 'Apr')

    BinnacleDesktopPO.clickPrevMonth()

    BinnacleDesktopPO.checkTimeWorkedValue('0h').checkTimeTrackingHours('0h')
  })
})
