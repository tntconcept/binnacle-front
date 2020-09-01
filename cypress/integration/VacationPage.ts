import { addDays, lightFormat } from 'date-fns'
context('Vacation page', () => {
  beforeEach(() => {
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/user/).as('getUser')

    cy.visit('/')

    cy.get(`[data-testid=username]`).type('testuser')
    cy.get(`[data-testid=password]`).type('holahola')
    cy.get(`[data-testid=login_button]`).click()

    cy.contains(/Demo/i).click()
  })

  it('displays skeletons on page load', () => {
    cy.get('.chakra-skeleton')
      .should('have.length', 8)
      .and('be.visible')

    // snapshot 'vacation-skeletons'

    cy.wait(['@getHolidays', '@getUser'])

    cy.contains('9/9/2020 - 9/18/2020')

    // snapshot 'vacations-page'
  })

  it('shows all the years since the user was hired', () => {
    cy.wait(['@getHolidays', '@getUser'])

    const years = ['2018', '2019', '2020']

    cy.findByLabelText('Year')
      .find('option')
      .should('have.length', years.length)

    years.forEach((year) => {
      cy.findByLabelText('Year').contains(year)
    })
  })

  it('updates the vacation information when the user changes the year', () => {
    cy.wait(['@getHolidays', '@getUser'])

    cy.findByLabelText('Year')
      .select('2019')
      .should('have.value', '2019')

    // select spinner should be visible
    cy.get('.chakra-spinner').should('be.visible')

    // skeletons should not show again if the request response time is below the 'timeoutMs' suspense config
    cy.get('.chakra-skeleton').should('not.exist')

    // @getUser is cached so is no need to wait.
    cy.wait('@getHolidays')

    cy.contains('There is no registered vacation period').should('be.visible')
  })

  it('request a new vacation period', () => {
    cy.route('POST', /holidays/).as('createVacationPeriod')

    cy.wait(['@getHolidays', '@getUser'])

    cy.contains('9/9/2020 - 9/18/2020')

    cy.findByRole('button', { name: /new vacation period/i }).click()

    // fill the form fields
    const startDate = lightFormat(new Date(), 'yyyy-MM-dd')
    const endDate = lightFormat(addDays(new Date(), 10), 'yyyy-MM-dd')

    cy.findByLabelText('Start date').type(startDate)
    cy.findByLabelText('End date').type(endDate)

    cy.findByLabelText('Description').type('Lorem ipsum.')
    cy.findByLabelText('Charge year').select('2020')

    // should send the create request and show the spinner
    cy.findByRole('button', { name: /save/i })
      .click()
      .should('be.disabled')
      .then(($button) => {
        cy.wrap($button)
          .find('.chakra-button__spinner')
          .should('exist')
      })

    // wait for both requests to finish
    cy.wait('@createVacationPeriod')

    // Modal should be open and in the loading state until the holidays are full updated
    cy.get('.chakra-button__spinner').should('exist')

    cy.wait('@getHolidays')

    // cy.findByText('Lorem ipsum.').should('be.visible')
    cy.contains('tbody', 'Lorem ipsum.').should('be.visible')
  })

  it.only('should request a new vacation period on other year', () => {
    cy.route('POST', /holidays/).as('createVacationPeriod')

    cy.wait(['@getHolidays', '@getUser'])

    cy.contains('9/9/2020 - 9/18/2020')

    cy.findByRole('button', { name: /new vacation period/i }).click()

    // fill the form fields
    const startDate = lightFormat(new Date(), 'yyyy-MM-dd')
    const endDate = lightFormat(addDays(new Date(), 10), 'yyyy-MM-dd')

    cy.findByLabelText('Start date').type(startDate)
    cy.findByLabelText('End date').type(endDate)

    cy.findByLabelText('Description').type('Vacation period charged on 2019')
    cy.findByLabelText('Charge year').select('2019')

    // should send the create request and show the spinner
    cy.findByRole('button', { name: /save/i }).click()

    // wait for both requests to finish
    cy.wait(['@createVacationPeriod', '@getHolidays'])

    cy.findByText('Vacation period charged on 2019').should('not.exist')

    cy.findByLabelText('Year')
      .select('2019')
      .should('have.value', '2019')

    cy.findByText('Vacation period charged on 2019')
      .should('exist')
      .and('be.visible')
  })

  it('updates the vacation period', () => {
    cy.server()
    cy.route('GET', /holidays/).as('getHolidays')
    cy.route(/vacation/).as('getVacationInfo')
    cy.route(/user/).as('getUser')
    cy.route('PUT', /holidays/).as('updateVacationPeriod')

    cy.wait(['@getHolidays', '@getVacationInfo', '@getUser'])

    cy.contains('9/17/2020 - 9/17/2020')

    cy.findByRole('button', { name: /edit/i }).click()

    // fill the form fields
    cy.findByLabelText('Vacation period').click()
    cy.findByRole('button', { name: '24' }).click()
    cy.findByRole('button', { name: '28' }).click()

    cy.findByLabelText('Description').type('Lorem ipsum UPDATED')
    cy.findByLabelText('Charge year').select('2020')

    // should send the create request and show the spinner
    cy.findByRole('button', { name: /save/i })
      .click()
      .should('be.disabled')
      .then(($button) => {
        cy.wrap($button)
          .find('.chakra-button__spinner')
          .should('exist')
      })

    // wait for both requests to finish
    cy.wait(['@updateVacationPeriod', '@getVacationInfo'])

    // Modal should be open and in the loading state until the holidays are full updated
    cy.get('.chakra-button__spinner').should('exist')

    cy.wait('@getHolidays')

    cy.findByText('Lorem ipsum UPDATED').should('be.visible')
  })

  it('deletes the vacation period', () => {
    cy.server()
    cy.route('GET', /holidays/).as('getHolidays')
    cy.route(/vacation/).as('getVacationInfo')
    cy.route(/user/).as('getUser')
    cy.route('DELETE', /holidays/).as('deleteVacationPeriod')

    cy.wait(['@getHolidays', '@getVacationInfo', '@getUser'])

    cy.contains('9/17/2020 - 9/17/2020')

    cy.findByRole('button', { name: /remove/i }).click()

    // Confirm the delete operation
    cy.findByRole('button', { name: /remove/i })
      .click()
      .should('be.disabled')
      .then(($button) => {
        cy.wrap($button)
          .find('.chakra-button__spinner')
          .should('exist')
      })

    cy.wait(['@deleteVacationPeriod', '@getVacationInfo'])

    cy.get('.chakra-button__spinner').should('exist')

    // Modal should be open and in the loading state until the holidays are full updated
    cy.wait('@getHolidays')

    cy.findByText('9/17/2020 - 9/17/2020').should('not.exist')
  })
})
