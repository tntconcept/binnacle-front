class LoginPO {
  static visit() {
    cy.visit('/');
  }

  static typeUsername(value: string) {
    const field = cy.get(`[data-testid=username]`);
    field.clear();
    field.type(value);

    return this;
  }

  static typePassword(value: string) {
    const field = cy.get(`[data-testid=password]`);
    field.clear();
    field.type(value);

    return this;
  }

  static togglePasswordVisibility() {
    cy.get(`[data-testid=password_visibility_button]`).click()
    return this
  }

  static submit() {
    const button = cy.get(`[data-testid=login_button]`);
    button.click();
  }

  static login(username = "testuser", password = "holahola") {
    this.typeUsername(username)
    this.typePassword(password)
    this.submit()
  }
}

export default LoginPO;
