describe('Vacation page', () => {
  beforeEach(() => {
    cy.resetDatabase()

    cy.intercept('GET', /vacations/).as('getVacations')
    cy.intercept('GET', /user/).as('getUser')
    cy.intercept('GET', /details/).as('getVacationDetails')

    cy.smartLoginTo('vacations')
  })

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
      .find('option:selected')
      .should('have.text', '2018')

    cy.wait(['@getVacations', '@getVacationDetails'])

    cy.findByRole('table').within(() => {
      cy.findByText('There is no registered vacation period').should('be.visible')
    })

    // 2018 vacation data
    cy.get('[data-testid=agreement_holidays]').should('contain.text', '22')
    cy.get('[data-testid=since_hiring_date]').should('contain.text', '15')
    cy.get('[data-testid=accepted_holidays]').should('contain.text', '0')
    cy.get('[data-testid=pending_holidays]').should('contain.text', '15')
  })

  it('request a new vacation period', () => {
    cy.intercept('POST', /vacations/).as('createVacationPeriod')

    cy.wait(['@getVacations', '@getUser', '@getVacationDetails'])

    cy.findByRole('button', { name: /new vacation period/i }).click()

    const DESCRIPTION = '10 days in 2019 and 5 days in 2020'
    cy.findByRole('dialog').within(() => {
      // fill the form fields
      cy.findByLabelText('Start date').type('2020-10-19')
      cy.findByLabelText('End date').type('2020-11-08')

      cy.get('[data-testid=working_days]').should('have.text', 15)

      cy.findByLabelText('Description').type(DESCRIPTION)

      cy.findByRole('button', { name: /save/i })
        .click()
        .should('be.disabled')
    })

    cy.wait('@createVacationPeriod').should((xhr) => {
      expect(xhr.request.body).to.deep.equal({
        description: '10 days in 2019 and 5 days in 2020',
        endDate: '2020-11-08T00:00:00.000Z',
        startDate: '2020-10-19T00:00:00.000Z'
      })
    })

    cy.wait(['@getVacations', '@getVacationDetails'])

    cy.findByRole('alert')
      .contains(
        '10 days of the period have been requested in the year 2019 and the rest in the year 2020'
      )
      .should('be.visible')

    cy.findByRole('table').within(() => {
      cy.findByText(DESCRIPTION).should('be.visible')
    })

    cy.findByLabelText('Filter by year of charge')
      .select('2019')
      .should('have.value', '2019')

    cy.wait(['@getVacations', '@getVacationDetails'])

    cy.findByRole('table').within(() => {
      cy.findByText(DESCRIPTION).should('be.visible')
    })
  })

  it('updates the vacation period', () => {
    cy.intercept('PUT', /vacations/).as('updateVacationPeriod')

    cy.wait(['@getVacations', '@getUser', '@getVacationDetails'])

    cy.findByRole('table').within(() => {
      cy.contains('Lorem ipsum...').should('be.visible')
      cy.findByRole('button', { name: /edit/i }).click()
    })

    const NEW_DESCRIPTION = 'Lorem ipsum text CHANGED'
    cy.findByRole('dialog').within(() => {
      // check form fields values
      cy.findByLabelText('Start date').should('have.value', '2020-04-20')
      cy.findByLabelText('End date').should('have.value', '2020-04-22')
      cy.findByLabelText('Description').should('have.value', 'Lorem ipsum...')

      // Modify description field
      cy.findByLabelText('Description')
        .clear()
        .type(NEW_DESCRIPTION)

      // should send the update request and show the spinner
      cy.findByRole('button', { name: /save/i })
        .click()
        .should('be.disabled')
    })

    cy.wait('@updateVacationPeriod').should((xhr) => {
      // Workaround to get always the same id
      const originalBody = { ...xhr.request.body }
      originalBody.id = 1

      expect(originalBody).to.deep.equal({
        description: 'Lorem ipsum text CHANGED',
        endDate: '2020-04-22T00:00:00.000Z',
        id: 1,
        startDate: '2020-04-20T00:00:00.000Z'
      })
    })

    cy.wait(['@getVacations', '@getVacationDetails'])

    cy.findByRole('alert')
      .contains('The period has been requested in the year 2020')
      .should('be.visible')

    cy.findByRole('table').within(() => {
      cy.findByText(NEW_DESCRIPTION).should('be.visible')
    })
  })

  it('deletes the vacation period', () => {
    cy.intercept('DELETE', /vacations/).as('deleteVacationPeriod')

    cy.wait(['@getVacations', '@getUser'])

    // We do this to check that after the delete operation the table is still showing the data of the selected year
    cy.findByLabelText('Filter by year of charge')
      .select('2019')
      .should('have.value', '2019')

    cy.wait('@getVacations')

    cy.findByRole('table').within(() => {
      cy.contains('Just for testing purposes, for the delete operation').should('be.visible')
      cy.findByRole('button', { name: /remove/i }).click()
    })

    cy.findByRole('alertdialog').within(() => {
      // Confirm the delete operation and disables the button if the request is pending
      cy.findByRole('button', { name: /remove/i })
        .click()
        .should('be.disabled')
    })

    // wait for delete request to finish
    cy.wait('@deleteVacationPeriod').should((xhr) => {
      expect(xhr.response!.statusCode).to.equal(202)
    })

    cy.wait('@getVacations')

    cy.findByRole('table').within(() => {
      cy.contains('Just for testing purposes, for the delete operation').should('not.exist')
    })

    cy.findByLabelText('Filter by year of charge').should('have.value', '2019')
  })
})
