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

    const years = ['2018', '2019', '2020', '2021', '2022', '2023']

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
    const today = new Date()
    // set startDate to format supported
    const startDateFormatted = today.toLocaleDateString('sv-SE') // yyy-MM-dd
    const endDate = today.setDate(today.getDate() + 6)
    // set endDate to format supported
    const endDateFormatted = new Date(endDate).toLocaleDateString('sv-SE') //yyy-MM-dd
    const yearBefore = today.getFullYear() - 1

    cy.wait(['@getVacations', '@getUser', '@getVacationDetails'])

    cy.findByRole('button', { name: /new vacation period/i }).click()

    const DESCRIPTION = `5 days in ${today.getFullYear()}`
    cy.findByRole('dialog').within(() => {
      // fill the form fields
      cy.findByLabelText('Start date').type(startDateFormatted)
      cy.findByLabelText('End date').type(endDateFormatted)

      cy.get('[data-testid=working_days]').should('have.text', 5)

      cy.findByLabelText('Description').type(DESCRIPTION)

      cy.findByRole('button', { name: /save/i }).click().should('be.disabled')
    })

    const endDateFormattedExpect = new Date(endDate).setHours(1, 0, 0, 0) // Will reset the hours to T00:00:00.000Z
    const endDateExpected = new Date(endDateFormattedExpect).toISOString()
    const startDateExpected = new Date(startDateFormatted).toISOString()

    cy.wait('@createVacationPeriod').should((xhr) => {
      expect(xhr.request.body).to.deep.equal({
        description: `5 days in ${today.getFullYear()}`,
        endDate: endDateExpected,
        startDate: startDateExpected
      })
    })

    cy.wait(['@getVacations', '@getVacationDetails'])

    cy.findByRole('alert')
      .contains(
        `The requested period of leave will be deducted from the year ${
          today.getFullYear() - 1
        } upon accepted`
      )
      .should('be.visible')

    cy.findByLabelText('Filter by year of charge')
      .select(yearBefore.toString())
      .should('have.value', yearBefore.toString())

    cy.wait(['@getVacations', '@getVacationDetails'])

    cy.findByRole('table').within(() => {
      cy.findByText(DESCRIPTION).should('be.visible')
    })
  })

  it('updates the vacation period', () => {
    cy.intercept('PUT', /vacations/).as('updateVacationPeriod')
    const today = new Date()

    cy.wait(['@getVacations', '@getUser', '@getVacationDetails'])

    cy.findByRole('table').within(() => {
      cy.contains('Lorem ipsum...').should('be.visible')
      cy.findByRole('button', { name: /edit/i }).click()
    })

    const NEW_DESCRIPTION = 'Lorem ipsum text CHANGED'
    cy.findByRole('dialog').within(() => {
      // check form fields values
      cy.findByLabelText('Start date').should('have.value', `${today.getFullYear()}-04-12`)
      cy.findByLabelText('End date').should('have.value', `${today.getFullYear()}-04-14`)
      cy.findByLabelText('Description').should('have.value', 'Lorem ipsum...')

      // Modify description field
      cy.findByLabelText('Description').clear().type(NEW_DESCRIPTION)

      // should send the update request and show the spinner
      cy.findByRole('button', { name: /save/i }).click().should('be.disabled')
    })

    cy.wait('@updateVacationPeriod').should((xhr) => {
      // Workaround to get always the same id
      const originalBody = { ...xhr.request.body }
      originalBody.id = 1

      expect(originalBody).to.deep.equal({
        description: 'Lorem ipsum text CHANGED',
        endDate: `${today.getFullYear()}-04-14T00:00:00.000Z`,
        id: 1,
        startDate: `${today.getFullYear()}-04-12T00:00:00.000Z`
      })
    })

    cy.wait(['@getVacations', '@getVacationDetails'])

    cy.findByRole('alert')
      .contains(
        `The requested period of leave will be deducted from the year ${today.getFullYear()} upon accepted`
      )
      .should('be.visible')

    cy.findByRole('table').within(() => {
      cy.findByText(NEW_DESCRIPTION).should('be.visible')
    })
  })

  it('deletes the vacation period', () => {
    cy.intercept('DELETE', /vacations/).as('deleteVacationPeriod')
    const today = new Date()
    const currentYear = today.getFullYear().toString()

    cy.wait(['@getVacations', '@getUser'])

    // We do this to check that after the delete operation the table is still showing the data of the selected year
    cy.findByLabelText('Filter by year of charge')
      .select(currentYear)
      .should('have.value', currentYear)

    cy.wait('@getVacations')

    cy.findByRole('table').within(() => {
      cy.contains('Lorem ipsum...').should('be.visible')
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
      cy.contains('Lorem ipsum...').should('not.exist')
    })

    cy.findByLabelText('Filter by year of charge').should('have.value', currentYear)
  })
})
