import LoginPO from '../page_objects/LoginPO'

describe('Vacation page', () => {
  beforeEach(() => {
    cy.resetDatabase()

    cy.server()
    cy.route(/vacations/).as('getVacations')
    cy.route(/user/).as('getUser')
    cy.route(/details/).as('getVacationDetails')

    cy.smartLoginTo('vacations')
  })

  function checkThatTableRenderedCorrectly() {
    cy.contains('tbody', 'Fake user comment')
  }

  it('shows all the years since the user was hired', () => {
    cy.wait(['@getVacations', '@getUser', '@getVacationDetails'])

    const years = ['2018', '2019', '2020', '2021']

    cy.findByLabelText('Filter by year of charge')
      .find('option')
      .should('have.length', years.length)

    years.forEach((year) => {
      cy.findByLabelText('Filter by year of charge').contains(year)
    })
  })

  it('updates the vacation information when the user changes the year', () => {
    cy.wait(['@getVacations', '@getUser', '@getVacationDetails'])

    // 2020 vacation data
    cy.get('[data-testid=agreement_holidays]').should('contain.text', '22')
    cy.get('[data-testid=since_hiring_date]').should('contain.text', '22')
    cy.get('[data-testid=accepted_holidays]').should('contain.text', '1')
    cy.get('[data-testid=pending_holidays]').should('contain.text', '18')

    cy.findByLabelText('Filter by year of charge')
      .select('2018')
      .should('have.value', '2018')

    // select spinner should be visible
    cy.get('.chakra-spinner').should('be.visible')

    // skeletons should not show again if the request response time is below the 'timeoutMs' suspense config
    cy.get('.chakra-skeleton').should('not.exist')

    // @getUser is cached so is no need to wait.
    cy.wait(['@getVacations', '@getVacationDetails'])

    cy.contains('tbody', 'There is no registered vacation period').should('be.visible')
    // 2018 vacation data
    cy.get('[data-testid=agreement_holidays]').should('contain.text', '22')
    cy.get('[data-testid=since_hiring_date]').should('contain.text', '15')
    cy.get('[data-testid=accepted_holidays]').should('contain.text', '0')
    cy.get('[data-testid=pending_holidays]').should('contain.text', '15')
  })

  it('request a new vacation period', () => {
    cy.route('POST', /vacations/).as('createVacationPeriod')

    cy.wait(['@getVacations', '@getUser', '@getVacationDetails'])

    checkThatTableRenderedCorrectly()

    cy.findByRole('button', { name: /new vacation period/i }).click()

    // fill the form fields
    const description = '10 days in 2019 and 5 days in 2020'

    cy.findByLabelText('Start date').type('2020-10-19')
    cy.findByLabelText('End date').type('2020-11-08')

    cy.contains('15 working days')

    cy.findByLabelText('Description').type(description)

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
    cy.wait('@createVacationPeriod').should((xhr) => {
      expect(xhr.status).to.equal(201)
      expect(xhr.request.body).to.deep.equal({
        description: '10 days in 2019 and 5 days in 2020',
        endDate: '2020-11-08T00:00:00.000Z',
        startDate: '2020-10-19T00:00:00.000Z'
      })
    })

    // Modal should be open and in the loading state until the holidays are full updated
    cy.get('.chakra-button__spinner').should('exist')

    cy.wait(['@getVacations', '@getVacationDetails'])

    cy.contains(
      '#chakra-toast-portal',
      '10 days of the period have been requested in the year 2019 and the rest in the year 2020'
    )
    cy.contains('tbody', description).should('be.visible')

    cy.findByLabelText('Filter by year of charge')
      .select('2019')
      .should('have.value', '2019')

    cy.wait(['@getVacations', '@getVacationDetails'])

    cy.contains('tbody', description).should('be.visible')
  })

  it('updates the vacation period', () => {
    cy.route('PUT', /vacations/).as('updateVacationPeriod')

    cy.wait(['@getVacations', '@getUser', '@getVacationDetails'])

    checkThatTableRenderedCorrectly()

    cy.findByRole('button', { name: /edit/i }).click()

    // check form fields values
    cy.findByLabelText('Start date').should('have.value', '2020-04-20')
    cy.findByLabelText('End date').should('have.value', '2020-04-22')
    cy.findByLabelText('Description').should('have.value', 'Lorem ipsum...')

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
    cy.wait('@updateVacationPeriod').should((xhr) => {
      expect(xhr.status).to.equal(200)

      // Workaround to get always the same id
      // @ts-ignore
      const originalBody = { ...xhr.request.body }
      originalBody.id = 1

      expect(originalBody).to.deep.equal({
        description: 'Lorem ipsum text CHANGED',
        endDate: '2020-04-22T00:00:00.000Z',
        id: 1,
        startDate: '2020-04-20T00:00:00.000Z'
      })
    })

    // Modal should be open and in the loading state until the holidays are full updated
    cy.get('.chakra-button__spinner').should('exist')

    cy.wait(['@getVacations', '@getVacationDetails'])

    cy.contains('#chakra-toast-portal', 'The period has been requested in the year 2020')
    cy.findByText(description).should('be.visible')
  })

  it('deletes the vacation period', () => {
    cy.route('DELETE', /vacations/).as('deleteVacationPeriod')

    cy.wait(['@getVacations', '@getUser'])

    checkThatTableRenderedCorrectly()

    // We do this to check that after the delete operation the table is still showing the data of the selected year
    cy.findByLabelText('Filter by year of charge')
      .select('2019')
      .should('have.value', '2019')

    cy.wait('@getVacations')

    cy.contains('tbody', 'Just for testing purposes, for the delete operation')

    cy.findByRole('button', { name: /remove/i }).click()

    // Confirm the delete operation
    // @ts-ignore
    cy.findByRole('button', { name: /remove/i, force: true })
      .click()
      .should('be.disabled')
      .then(($button) => {
        cy.wrap($button)
          .find('.chakra-button__spinner')
          .should('exist')
      })

    // wait for delete request to finish
    cy.wait('@deleteVacationPeriod').should((xhr) => {
      expect(xhr.status).to.equal(202)
    })

    // modal is still open and in the loading state
    cy.get('.chakra-button__spinner').should('exist')

    cy.wait('@getVacations')

    cy.contains('tbody', 'Just for testing purposes, for the delete operation').should('not.exist')
    cy.findByLabelText('Filter by year of charge').should('have.value', '2019')
  })
})
