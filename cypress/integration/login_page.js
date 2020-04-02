/// <reference types="cypress" />
import LoginPage from "../page_objects/LoginPage"

context("Login page", () => {
  beforeEach(() => {
    new LoginPage().visit();
  });

  it("should login", () => {
    const loginPage = new LoginPage()

    loginPage.login()

    cy.title().should('eq', 'Binnacle')
  });
});
