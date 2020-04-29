import LoginPO from "../page_objects/LoginPO"

context("Login page", () => {
  beforeEach(() => {
    LoginPO.visit();
  });

  it("should login", () => {
    LoginPO.login()

    cy.location("pathname").should('eq', '/binnacle')
  });

  it('should validate fields', function () {
    LoginPO
      .submit()

    cy.get(`[data-testid=input_error_message]`).should('be.visible').and('have.length', 2)
  });

  it('should show unauthorized notification when the user enters wrong username or password',  () => {
    LoginPO.login("fakeuser", "wrongpassword")

    cy.contains("Username or password does not match").should("be.visible");

    cy.get(`[data-testid=username]`).should("be.empty").and('be.focused')
    cy.get(`[data-testid=password]`).should("be.empty")
  });

  it('should show password', function () {
    LoginPO.typeUsername("username name")
    LoginPO.typePassword("password text")
    LoginPO.togglePasswordVisibility()

    cy.get(`[data-testid=password]`)
      .invoke('attr', 'type')
      .should('include', 'text')
  });

});
