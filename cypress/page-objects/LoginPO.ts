export class LoginPO {
  static visit() {
    cy.visit('/')
  }

  static typeUsername(value: string) {
    cy.get(`[data-testid=username]`).clear().type(value)

    return this
  }

  static typePassword(value: string) {
    cy.get(`[data-testid=password]`).clear().type(value)

    return this
  }

  static togglePasswordVisibility() {
    cy.get(`[data-testid=password_visibility_button]`).click()
    return this
  }

  static submit() {
    cy.get(`[data-testid=login_button]`).click()
  }

  static login(username = 'admin', password = 'adminadmin') {
    this.typeUsername(username)
    this.typePassword(password)
    this.submit()
  }
}
