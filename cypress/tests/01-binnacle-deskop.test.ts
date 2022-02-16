import BinnacleDesktopPO from '../page-objects/BinnacleDesktopPO'

describe('Binnacle Desktop Page', () => {
  beforeEach(() => {
    cy.resetDatabase().then(() => cy.smartLoginTo('binnacle'))

    cy.intercept(/holidays/).as('getHolidays')
    cy.intercept(/activities/).as('getActivities')
    cy.intercept(/working-time/).as('getWorkingTime')
  })

  it('should be able to see holidays', function () {
    cy.wait(['@getHolidays', '@getWorkingTime', '@getActivities'])

    // Public holidays
    cy.contains('Public Holiday Testing').should('be.visible')

    // Private holidays
    cy.contains('Vacations').should('be.visible')
  })

  it('should show recent roles list when the new activity is not in the last 30 days', function () {
    cy.wait(['@getHolidays', '@getWorkingTime', '@getActivities'])

    BinnacleDesktopPO.clickPrevMonth()
    BinnacleDesktopPO.checkTimeWorkedValue('4h').checkTimeTrackingHours('432h 31m')

    cy.findByLabelText('9, Monday March 2020').click().wait(400)

    cy.findByRole('dialog').within(() => {
      cy.contains('Select role').should('be.visible')
    })

    // Close modal using ESCAPE key
    cy.get('body').type('{esc}')

    cy.findByLabelText('24, Tuesday March 2020').click().wait(400)

    cy.findByRole('dialog').within(() => {
      cy.contains('Recent roles').should('exist').and('be.visible')
    })
  })

  it('should show time by year', function () {
    cy.wait(['@getHolidays', '@getActivities'])

    cy.wait('@getWorkingTime').should((xhr) => {
      expect(xhr.request.url).to.include('?date=2020-04-10')
    })

    cy.get('[data-testid=select]').select('Year')

    BinnacleDesktopPO.checkTimeWorkedValue('12h').checkTimeTrackingHours('1765h')
  })

  it('should preview the activity', function () {
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
