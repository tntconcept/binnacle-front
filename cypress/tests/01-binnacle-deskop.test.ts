import BinnacleDesktopPO from '../page-objects/BinnacleDesktopPO'

describe('Binnacle Desktop Page', () => {
  beforeEach(() => {
    cy.resetDatabase()

    cy.intercept(/holidays/).as('getHolidays')
    cy.intercept(/time-balance/).as('getTimeBalance')
    cy.intercept(/activities/).as('getActivities')
  })

  it('should be able to see holidays', function() {
    cy.smartLoginTo('binnacle')

    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities'])

    // Public holidays
    cy.contains('Public Holiday Testing').should('be.visible')

    // Private holidays
    cy.contains('Vacations').should('be.visible')
  })

  it('should not show recent roles list when the new activity is not in the last 30 days', function() {
    cy.smartLoginTo('binnacle')

    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities'])

    BinnacleDesktopPO.clickPrevMonth()
    BinnacleDesktopPO.checkTimeWorkedValue('4h')
      .checkTimeToWorkValue('176h')
      .checkTimeBalanceValue('-172h')

    cy.findByLabelText('9, Monday March 2020')
      .click()
      .wait(400)

    cy.findByRole('dialog').within(() => {
      cy.contains('Select role').should('be.visible')
    })

    // Close modal using ESCAPE key
    cy.get('body').type('{esc}')

    cy.findByLabelText('24, Tuesday March 2020')
      .click()
      .wait(400)

    cy.findByRole('dialog').within(() => {
      cy.contains('Recent roles')
        .should('exist')
        .and('be.visible')
    })
  })

  it('should calculate time by year', function() {
    cy.smartLoginTo('binnacle')

    cy.wait(['@getHolidays', '@getActivities'])

    // Check that the time balance is requested from the first day of month until the last day
    cy.wait('@getTimeBalance').should((xhr) => {
      expect(xhr.request.url).to.include('?startDate=2020-04-01&endDate=2020-04-30')
    })

    cy.get('[data-testid=select]').select('Year balance')

    // Check that the time balance is requested from the first day of year until the last day of selected month
    cy.wait('@getTimeBalance').should((xhr) => {
      expect(xhr.request.url).to.include('?startDate=2020-01-01&endDate=2020-04-30')
    })

    BinnacleDesktopPO.checkTimeWorkedValue('12h')
      .checkTimeToWorkValue('648h')
      .checkTimeBalanceValue('-524h')
  })

  it('should show time balance only if the user selects a previous month or current month is selected', function() {
    cy.smartLoginTo('binnacle')
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

    cy.get('[data-testid=select]').should('not.exist')
    cy.contains('Month balance').should('not.exist')
  })

  it('should preview the activity', function() {
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
    cy.smartLoginTo('binnacle')

    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities'])

    cy.contains('14:00 - 18:00 Dashboard')
      .parent()
      .trigger('mouseenter')

    cy.get('[data-testid=activity_tooltip]').should('be.visible')
    cy.contains('Activity created for end-to-end tests').should('be.visible')
  })

  it('should calculate time balance from user hiring date instead of first day of month when the user was hired in the selected MONTH', function() {
    cy.intercept('api/user', {
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

    cy.smartLoginTo('binnacle')

    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities', '@getUser'])

    BinnacleDesktopPO.clickPrevMonth()

    cy.wait('@getTimeBalance').should((xhr) => {
      expect(xhr.request.url).to.include('?startDate=2020-03-04&endDate=2020-03-31')
    })

    BinnacleDesktopPO.checkTimeWorkedValue('4h')
      .checkTimeToWorkValue('160h')
      .checkTimeBalanceValue('-156h')
  })

  it('should show only time to work on months that are before hiring month', function() {
    cy.intercept('api/user', {
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

    cy.smartLoginTo('binnacle')

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

  it('should calculate time balance from user hiring date instead of first day of year when the user was hired in the selected YEAR', function() {
    cy.intercept('api/user', {
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

    cy.smartLoginTo('binnacle')

    cy.wait(['@getHolidays', '@getTimeBalance', '@getActivities', '@getUser'])
    cy.get('[data-testid=select]').select('Year balance')

    cy.wait('@getTimeBalance').should((xhr) => {
      expect(xhr.request.url).to.include('?startDate=2020-03-04&endDate=2020-04-30')
    })

    BinnacleDesktopPO.checkTimeWorkedValue('12h')
      .checkTimeToWorkValue('312h')
      .checkTimeBalanceValue('-188h')
  })
})
