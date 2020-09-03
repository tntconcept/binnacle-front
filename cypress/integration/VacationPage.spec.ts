import { addDays, lightFormat } from 'date-fns'

describe('Vacation page', () => {
  beforeEach(() => {
    cy.resetDatabase()

    cy.server()
    cy.route(/holidays/).as('getHolidays')
    cy.route(/user/).as('getUser')

    cy.smartLoginTo('vacation')
  })

  function checkThatTableRenderedCorrectly() {
    cy.contains('tbody', 'Fake user comment')
  }

  it('displays skeletons on page load', () => {
    cy.get('.chakra-skeleton')
      .should('have.length', 8)
      .and('be.visible')

    // snapshot 'vacation-skeletons'

    cy.wait(['@getHolidays', '@getUser'])

    checkThatTableRenderedCorrectly()

    // snapshot 'vacations-page'
  })

  it('shows all the years since the user was hired', () => {
    cy.wait(['@getHolidays', '@getUser'])

    const years = ['2018', '2019', '2020']

    cy.findByLabelText('Filter by year of charge')
      .find('option')
      .should('have.length', years.length)

    years.forEach((year) => {
      cy.findByLabelText('Filter by year of charge').contains(year)
    })
  })

  it('updates the vacation information when the user changes the year', () => {
    cy.wait(['@getHolidays', '@getUser'])

    // 2020 vacation data
    cy.get('[data-testid=agreement_holidays]').should('contain.text', '22')
    cy.get('[data-testid=since_hiring_date]').should('contain.text', '22')
    cy.get('[data-testid=accepted_holidays]').should('contain.text', '1')
    cy.get('[data-testid=pending_holidays]').should('contain.text', '21')

    cy.findByLabelText('Filter by year of charge')
      .select('2018')
      .should('have.value', '2018')

    // select spinner should be visible
    cy.get('.chakra-spinner').should('be.visible')

    // skeletons should not show again if the request response time is below the 'timeoutMs' suspense config
    cy.get('.chakra-skeleton').should('not.exist')

    // @getUser is cached so is no need to wait.
    cy.wait('@getHolidays')

    cy.contains('tbody', 'There is no registered vacation period').should(
      'be.visible'
    )
    // 2018 vacation data
    cy.get('[data-testid=agreement_holidays]').should('contain.text', '22')
    cy.get('[data-testid=since_hiring_date]').should('contain.text', '15')
    cy.get('[data-testid=accepted_holidays]').should('contain.text', '0')
    cy.get('[data-testid=pending_holidays]').should('contain.text', '15')
  })

  it('request a new vacation period', () => {
    cy.route('POST', /holidays/).as('createVacationPeriod')

    cy.wait(['@getHolidays', '@getUser'])

    checkThatTableRenderedCorrectly()

    cy.findByRole('button', { name: /new vacation period/i }).click()

    // fill the form fields
    const startDate = lightFormat(new Date(), 'yyyy-MM-dd')
    const endDate = lightFormat(addDays(new Date(), 10), 'yyyy-MM-dd')
    const description = 'cypress fake description'

    cy.findByLabelText('Start date').type(startDate)
    cy.findByLabelText('End date').type(endDate)

    cy.findByLabelText('Description').type(description)
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

    // wait for create request to finish
    cy.wait('@createVacationPeriod')

    // Modal should be open and in the loading state until the holidays are full updated
    cy.get('.chakra-button__spinner').should('exist')

    cy.wait('@getHolidays')

    // cy.findByText('Lorem ipsum.').should('be.visible')
    cy.contains('tbody', description).should('be.visible')
  })

  it('should request a new vacation period on other year', () => {
    cy.route('POST', /holidays/).as('createVacationPeriod')

    cy.wait(['@getHolidays', '@getUser'])

    checkThatTableRenderedCorrectly()

    cy.findByRole('button', { name: /new vacation period/i }).click()

    // fill the form fields
    const startDate = lightFormat(new Date(), 'yyyy-MM-dd')
    const endDate = lightFormat(addDays(new Date(), 10), 'yyyy-MM-dd')
    const description = 'Vacation period charged on 2019'

    cy.findByLabelText('Start date').type(startDate)
    cy.findByLabelText('End date').type(endDate)

    cy.findByLabelText('Description').type(description)
    cy.findByLabelText('Charge year').select('2019')

    // should send the create request and show the spinner
    cy.findByRole('button', { name: /save/i }).click()

    // wait for create request to finish
    cy.wait(['@createVacationPeriod', '@getHolidays'])

    cy.contains('tbody', description).should('not.exist')

    cy.findByLabelText('Filter by year of charge')
      .select('2019')
      .should('have.value', '2019')

    cy.contains('tbody', description)
      .should('exist')
      .and('be.visible')
  })

  it('updates the vacation period', () => {
    cy.route('PUT', /holidays/).as('updateVacationPeriod')

    cy.wait(['@getHolidays', '@getUser'])

    checkThatTableRenderedCorrectly()

    cy.findByRole('button', { name: /edit/i }).click()

    // check form fields values
    cy.findByLabelText('Start date').should('have.value', '2020-04-20')
    cy.findByLabelText('End date').should('have.value', '2020-04-22')
    cy.findByLabelText('Description').should('have.value', 'Lorem ipsum...')
    cy.findByLabelText('Charge year').should('have.value', '2020-01-01')

    // Modify description field
    const description = 'Lorem ipsum text CHANGED'
    cy.findByLabelText('Description')
      .clear()
      .type(description)

    // should send the update request and show the spinner
    cy.findByRole('button', { name: /save/i })
      .click()
      .should('be.disabled')
      .then(($button) => {
        cy.wrap($button)
          .find('.chakra-button__spinner')
          .should('exist')
      })

    // wait for update request to finish
    cy.wait('@updateVacationPeriod')

    // Modal should be open and in the loading state until the holidays are full updated
    cy.get('.chakra-button__spinner').should('exist')

    cy.wait('@getHolidays')

    cy.findByText(description).should('be.visible')
  })

  it('deletes the vacation period', () => {
    cy.route('DELETE', /holidays/).as('deleteVacationPeriod')

    cy.wait(['@getHolidays', '@getUser'])

    checkThatTableRenderedCorrectly()

    // We do this to check that after the delete operation the table is still showing the data of the selected year
    cy.findByLabelText('Filter by year of charge')
      .select('2019')
      .should('have.value', '2019')

    cy.wait('@getHolidays')
    cy.contains('tbody', 'Just for testing purposes, for the delete operation')

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

    // wait for delete request to finish
    cy.wait('@deleteVacationPeriod')

    // modal is still open and in the loading state
    cy.get('.chakra-button__spinner').should('exist')

    cy.wait('@getHolidays')

    cy.contains(
      'tbody',
      'Just for testing purposes, for the delete operation'
    ).should('not.exist')
    cy.findByLabelText('Filter by year of charge').should('have.value', '2019')
  })

  it('moves the vacation from current selected year to the selected charge year in form on edit', () => {
    cy.route('PUT', /holidays/).as('updateVacationPeriod')

    cy.wait(['@getHolidays', '@getUser'])

    checkThatTableRenderedCorrectly()

    // edit the vacation period
    cy.findByRole('button', { name: /edit/i }).click()
    cy.findByLabelText('Charge year').should('have.value', '2020-01-01')

    // change vacation period
    cy.findByLabelText('Charge year')
      .select('2019')
      .should('have.value', '2019-01-01')
    cy.findByRole('button', { name: /save/i }).click()

    cy.wait(['@getHolidays', '@updateVacationPeriod'])

    cy.findByLabelText('Filter by year of charge').should('have.value', '2020')
    cy.contains('tbody', 'Fake user comment').should('exist')

    cy.contains('tbody', 'Lorem ipsum...').should('not.exist')

    cy.findByLabelText('Filter by year of charge')
      .select('2019')
      .should('have.value', '2019')

    cy.contains('tbody', 'Lorem ipsum...')
      .should('exist')
      .and('be.visible')
  })
})
