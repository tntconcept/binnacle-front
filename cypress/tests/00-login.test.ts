describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should redirect unauthenticated user to login page', function () {
    cy.visit('/binnacle')
    cy.location('pathname').should('equal', '/binnacle/')
  })

  /*  it('should display login form errors', function () {
    // First enable the on change validation by submitting the form first,
    // thats because of react-hook-form default onSubmit mode
    cy.contains(/login/i).click()

    cy.findByLabelText(/username/i)
      .type('hi', { delay: 40 })
      .clear()
      .blur()
    cy.get('#username_field-feedback').should('be.visible').and('contain', 'Field is required')

    cy.findByLabelText(/password/i)
      .type('hi', { delay: 40 })
      .clear()
      .blur()

    cy.get('#password_field-feedback').should('be.visible').and('contain', 'Field is required')
  }) */

  it('should login and logout', () => {
    cy.intercept('POST', /oauth/).as('login')

    cy.findByLabelText(/username/i)
      // should autofocus the username on mount
      .should('be.focused')
      .type('testuser', { delay: 40 })
    cy.findByLabelText(/password/i).type('holahola{enter}', { delay: 40 })

    cy.wait('@login')
      .its('request.body')
      .should('equal', 'grant_type=password&username=admin&password=adminadmin')

    cy.location('pathname').should('eq', '/binnacle/')

    // Logout
    cy.contains(/logout/i).click()
    cy.location('pathname').should('eq', '/binnacle/')
  })

  it('should show unauthorized notification when the user enters wrong username or password and close it', () => {
    cy.intercept('POST', /oauth/).as('login')

    cy.findByLabelText(/username/i).type('fakeuser', { delay: 40 })
    cy.findByLabelText(/password/i).type('wrongpassword{enter}', { delay: 40 })

    cy.wait('@login')

    cy.findByRole('alert').contains('Tu usuario o contraseña no coinciden').should('be.visible')

    // should clear the fields and focus the username
    cy.findByLabelText(/username/i)
      .should('be.empty')
      .and('be.focused')
    cy.findByLabelText(/password/i).should('be.empty')
  })

  it('should keep the fields values when is not an unauthorized request error', function () {
    cy.intercept('POST', /oauth/, {
      statusCode: 400,
      body: {}
    }).as('login')

    cy.findByLabelText(/username/i).type('fakeuser', { delay: 40 })
    cy.findByLabelText(/password/i).type('wrongpassword{enter}', { delay: 40 })

    cy.wait('@login')

    cy.findByRole('alert').should('exist')

    cy.findByLabelText(/username/i).should('have.value', 'fakeuser')
    cy.findByLabelText(/password/i).should('have.value', 'wrongpassword')

    // Close notification
    cy.findByRole('alert').within(() => {
      cy.findByLabelText('Close').click()
    })

    cy.findByRole('alert').should('not.exist')
  })
})
