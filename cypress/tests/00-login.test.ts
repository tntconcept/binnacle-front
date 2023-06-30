describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/')
    Cypress.on('uncaught:exception', (err) => {
      if (err.stack.includes('at HttpSharedUserRepository.getUser')) {
        return false
      }
    })
    cy.intercept('GET', 'https://accounts.google.com/v3/signin/**', (req) => {
      // Simulate a successful login response
      req.reply({
        statusCode: 200,
        body: {
          token: 'mocked-token',
          user: {
            name: 'John Doe',
            email: 'johndoe@example.com'
            // Add other relevant user data
          }
        }
      })
    })
  })

  it('should redirect unauthenticated user to login page', () => {
    cy.visit('/binnacle')
    cy.location('pathname').should('equal', '/tnt/login')
  })

  it.only('should login', () => {
    cy.findByText('Sign in with Google').click()
    cy.location('pathname').should('equal', '/tnt/binnacle')
  })

  it('should show unauthorized notification when the user enters wrong username or password and close it', () => {
    cy.intercept('POST', /oauth/).as('login')

    cy.findByLabelText(/username/i).type('fakeuser', { delay: 40 })
    cy.findByLabelText(/password/i).type('wrongpassword{enter}', { delay: 40 })

    cy.wait('@login')

    cy.findByRole('alert').contains('Username or password does not match').should('be.visible')

    // should clear the fields and focus the username
    cy.findByLabelText(/username/i)
      .should('be.empty')
      .and('be.focused')
    cy.findByLabelText(/password/i).should('be.empty')
  })

  it('should keep the fields values when is not an unauthorized request error', () => {
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
