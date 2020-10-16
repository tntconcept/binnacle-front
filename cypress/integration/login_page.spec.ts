import LoginPO from '../page_objects/LoginPO'

context('Login page', () => {
  beforeEach(() => {
    LoginPO.visit()
  })

  it('should login', () => {
    LoginPO.login()

    cy.location('pathname').should('eq', '/binnacle/binnacle')
  })

  it('should validate fields', function() {
    cy.get(`[data-testid=username]`).clear()
    cy.get(`[data-testid=password]`).clear()
    LoginPO.submit()

    cy.get('#username-feedback').should('have.text', 'Field is required')
    cy.get('#password-feedback').should('have.text', 'Field is required')
  })

  it('should show unauthorized notification when the user enters wrong username or password', () => {
    LoginPO.login('fakeuser', 'wrongpassword')

    cy.contains('Username or password does not match').should('be.visible')

    cy.get(`[data-testid=username]`)
      .should('be.empty')
      .and('be.focused')

    cy.get(`[data-testid=password]`).should('be.empty')
  })

  it('should show password', function() {
    LoginPO.typeUsername('username name')
    LoginPO.typePassword('password text')
    LoginPO.togglePasswordVisibility()

    cy.get(`[data-testid=password]`)
      .invoke('attr', 'type')
      .should('include', 'text')
  })

  it('should not display placeholders when the user logs in', () => {
    cy.server()
    cy.route({
      delay: 400,
      method: 'GET',
      url: /holidays/,
      response: {
        publicHolidays: [],
        privateHolidays: []
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
