import '@testing-library/cypress/add-commands'

context('Vacation page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays skeletons on page load', () => {
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/vacation/).as('getVacationInfo')

    cy.get('.chakra-skeleton')
      .should('have.length', 8)
      .and('be.visible')

    // snapshot 'vacation-skeletons'

    cy.wait(['@getHolidays', '@getVacationInfo'])

    cy.contains('9/17/2020 - 9/17/2020')

    // snapshot 'vacations-page'
  })

  it('shows all the years since the user was hired', () => {
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/vacation/).as('getVacationInfo')

    cy.wait(['@getHolidays', '@getVacationInfo'])

    cy.findByLabelText('Year')
      .find('option')
      .should('have.length', 4)
    const years = ['2017', '2018', '2019', '2020']
    years.forEach((year) => {
      cy.findByLabelText('Year').contains(year)
    })
  })

  it('updates the vacation information when the user changes the year', () => {
    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/vacation/).as('getVacationInfo')

    cy.wait(['@getHolidays', '@getVacationInfo'])

    cy.findByLabelText('Year')
      .select('2019')
      .should('have.value', '2019')

    // select spinner should be visible
    cy.get('.chakra-spinner').should('be.visible')

    // skeletons should not show again if the request response time is below the 'timeoutMs' suspense config
    cy.get('.chakra-skeleton').should('not.exist')

    cy.wait(['@getHolidays', '@getVacationInfo'])

    cy.contains('There is no registered vacation period').should('be.visible')
  })

  it('request a new vacation period', () => {
    cy.server()
    cy.route('GET', /holidays/).as('getHolidays')
    cy.route(/vacation/).as('getVacationInfo')
    cy.route(/user/).as('getUser')
    cy.route('POST', /holidays/).as('createVacationPeriod')

    cy.wait(['@getHolidays', '@getVacationInfo', '@getUser'])

    cy.contains('9/17/2020 - 9/17/2020')

    cy.findByRole('button', { name: /new vacation period/i }).click()

    // fill the form fields
    cy.findByLabelText('Vacation period').click()
    cy.findByRole('button', { name: '24' }).click()
    cy.findByRole('button', { name: '28' }).click()

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
    cy.wait(['@createVacationPeriod', '@getVacationInfo'])

    // Modal should be open and in the loading state until the holidays are full updated
    cy.get('.chakra-button__spinner').should('exist')

    cy.wait('@getHolidays')

    cy.findByText('Lorem ipsum.').should('be.visible')
  })

  it('should request a new vacation period on other year', () => {
    cy.server()
    cy.route('GET', /holidays/).as('getHolidays')
    cy.route(/vacation/).as('getVacationInfo')
    cy.route(/user/).as('getUser')
    cy.route('POST', /holidays/).as('createVacationPeriod')

    cy.wait(['@getHolidays', '@getVacationInfo', '@getUser'])

    cy.contains('9/17/2020 - 9/17/2020')

    cy.findByRole('button', { name: /new vacation period/i }).click()

    // fill the form fields
    cy.findByLabelText('Vacation period').click()
    cy.findByRole('button', { name: '24' }).click()
    cy.findByRole('button', { name: '28' }).click()

    cy.findByLabelText('Description').type('Vacation period charged on 2019')
    cy.findByLabelText('Charge year').select('2019')

    // should send the create request and show the spinner
    cy.findByRole('button', { name: /save/i }).click()

    // wait for both requests to finish
    cy.wait(['@createVacationPeriod', '@getVacationInfo', '@getHolidays'])

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
