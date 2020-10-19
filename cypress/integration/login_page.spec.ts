import LoginPO from '../page_objects/LoginPO'

context('Login page', () => {
  beforeEach(() => {
    LoginPO.visit()
  })

  it('should login', () => {
    LoginPO.login()

    cy.location('pathname').should('eq', '/binnacle/binnacle')
  })

  it('should show unauthorized notification when the user enters wrong username or password', () => {
    LoginPO.login('fakeuser', 'wrongpassword')

    cy.contains('Username or password does not match').should('be.visible')

    cy.get(`[data-testid=username]`)
      .should('be.empty')
      .and('be.focused')

    cy.get(`[data-testid=password]`).should('be.empty')
  })

  it('should not display placeholders when the user logs in', () => {
    cy.server()
    cy.route({
      delay: 400,
      method: 'GET',
      url: /holidays/,
      response: {
        holidays: [],
        vacations: []
      }
    }).as('holiday')

    LoginPO.login()
    cy.wait('@holiday')

    cy.get('[data-testid=calendar_placeholder]').should('not.exist')

    cy.location('pathname').should('eq', '/binnacle/binnacle')

    cy.contains('Logout').click()

    LoginPO.login()
    cy.wait('@holiday')

    cy.get('[data-testid=calendar_placeholder]', { timeout: 0 }).should('not.be.visible')

    cy.location('pathname').should('eq', '/binnacle/binnacle')
  })
})
