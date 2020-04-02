/// <reference types="cypress" />

class LoginPage {
  visit() {
    cy.visit('/');
  }

  typeUsername(value) {
    const field = cy.get(`[data-testid=username]`);
    field.clear();
    field.type(value);

    return this;
  }

  typePassword(value) {
    const field = cy.get(`[data-testid=password]`);
    field.clear();
    field.type(value);

    return this;
  }

  getUsernameError() {
    return cy.get(`[data-testid=SignInEmailError]`);
  }

  getPasswordError() {
    return cy.get(`[data-testid=SignInPasswordError]`);
  }


  submit() {
    const button = cy.get(`[data-testid=login_button]`);
    button.click();
  }

  login(username = "testuser", password = "holahola") {
    this.typeUsername("testuser")
    this.typePassword("holahola")
    this.submit()
  }
}

export default LoginPage;
