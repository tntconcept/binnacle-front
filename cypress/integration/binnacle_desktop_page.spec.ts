import BinnacleDesktopPO from '../page_objects/BinnacleDesktopPO'

describe('Binnacle Desktop Page', () => {
  beforeEach(() => {
    cy.resetDatabase()
    cy.smartLoginTo('binnacle')

    window.localStorage.setItem(
      'binnacle_settings',
      JSON.stringify({
        theme: 'light',
        autofillHours: true,
        hoursInterval: ['09:00', '13:00', '14:00', '18:00'],
        showDurationInput: false,
        useDecimalTimeFormat: false,
        // changes the showDescription to false...
        showDescription: false
      })
    )
  })

  it('should be able to see holidays', function() {
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/time-balance/).as('getTimeBalance')
    cy.route(/activities/).as('getActivities')
    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities'])

    // Public holidays
    cy.contains('Public Holiday Testing').should('be.visible')

    // Compensation days
    cy.contains('Compensation Day Testing').should('be.visible')

    // Private holidays
    cy.contains('Vacations').should('be.visible')
  })

  it('should not show recent roles list when the new activity is not in the last 30 days', function() {
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/time-balance/).as('getTimeBalance')
    cy.route(/activities/).as('getActivities')
    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities'])

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
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/time-balance/).as('getTimeBalance')
    cy.route(/activities/).as('getActivities')
    cy.wait(['@getHolidays', '@getActivities'])

    // Check that the time balance is requested from the first day of month until the last day
    cy.wait('@getTimeBalance').should((xhr) => {
      expect(xhr.url).to.include('?startDate=2020-04-01&endDate=2020-04-30')
    })

    cy.get('[data-testid=select]').select('Year balance')

    // Check that the time balance is requested from the first day of year until the last day of selected month
    cy.wait('@getTimeBalance').should((xhr) => {
      expect(xhr.url).to.include('?startDate=2020-01-01&endDate=2020-04-30')
    })

    BinnacleDesktopPO.checkTimeWorkedValue('12h')
      .checkTimeToWorkValue('648h')
      .checkTimeBalanceValue('-524h')
  })

  it('should show time balance only if the user selects a previous month or current month is selected', function() {
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/time-balance/).as('getTimeBalance')
    cy.route(/activities/).as('getActivities')
    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities'])

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
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/time-balance/).as('getTimeBalance')
    cy.route(/activities/).as('getActivities')
    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities'])

    cy.contains('14:00 - 18:00 Project: Dashboard').trigger('mouseover')

    cy.get('[data-testid=activity_tooltip]').should('be.visible')
    cy.contains('Activity created for end-to-end tests').should('be.visible')
  })

  it('should calculate time balance from user hiring date instead of first day of month when the user was hired in the selected MONTH', function() {
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/time-balance/).as('getTimeBalance')
    cy.route(/activities/).as('getActivities')
    cy.route('api/user', {
      id: 1,
      username: 'testuser',
      departmentId: 1,
      name: 'Test user',
      photoUrl: null,
      dayDuration: 480,
      agreement: { id: 1, holidaysQuantity: 22, yearDuration: 0 },
      agreementYearDuration: null,
      hiringDate: '2020-03-04',
      email: null,
      role: { id: 3, name: 'Usuario' }
    }).as('getUser')

    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities', '@getUser'])

    BinnacleDesktopPO.clickPrevMonth()

    cy.wait('@getTimeBalance').should((xhr) => {
      expect(xhr.url).to.include('?startDate=2020-03-04&endDate=2020-03-31')
    })

    BinnacleDesktopPO.checkTimeWorkedValue('4h')
      .checkTimeToWorkValue('160h')
      .checkTimeBalanceValue('-156h')
  })

  it('should show only time to work on months that are before hiring month', function() {
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/time-balance/).as('getTimeBalance')
    cy.route(/activities/).as('getActivities')
    cy.route('api/user', {
      id: 1,
      username: 'testuser',
      departmentId: 1,
      name: 'Test user',
      photoUrl: null,
      dayDuration: 480,
      agreement: { id: 1, holidaysQuantity: 22, yearDuration: 0 },
      agreementYearDuration: null,
      hiringDate: '2020-03-04',
      email: null,
      role: { id: 3, name: 'Usuario' }
    }).as('getUser')

    // prev month, the user see hiring month
    BinnacleDesktopPO.clickPrevMonth()

    cy.get('[data-testid=time_worked_value]').should('exist')
    cy.get('[data-testid=time_balance_value]').should('exist')

    // prev hired month
    BinnacleDesktopPO.clickPrevMonth()

    // now should hide the month balance and time work
    cy.get('[data-testid=time_worked_value]').should('not.exist')
    cy.get('[data-testid=time_balance_value]').should('not.exist')
  })

  it.only('should calculate time balance from user hiring date instead of first day of year when the user was hired in the selected YEAR', function() {
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/time-balance/).as('getTimeBalance')
    cy.route(/activities/).as('getActivities')
    cy.route('api/user', {
      id: 1,
      username: 'testuser',
      departmentId: 1,
      name: 'Test user',
      photoUrl: null,
      dayDuration: 480,
      agreement: { id: 1, holidaysQuantity: 22, yearDuration: 0 },
      agreementYearDuration: null,
      hiringDate: '2020-03-04',
      email: null,
      role: { id: 3, name: 'Usuario' }
    }).as('getUser')

    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities', '@getUser'])
    cy.get('[data-testid=select]').select('Year balance')

    cy.wait('@getTimeBalance').should((xhr) => {
      expect(xhr.url).to.include('?startDate=2020-03-04&endDate=2020-04-30')
    })

    BinnacleDesktopPO.checkTimeWorkedValue('12h')
      .checkTimeToWorkValue('312h')
      .checkTimeBalanceValue('-188h')
  })
})
