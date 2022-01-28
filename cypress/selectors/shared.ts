export const shared = {
  notification() {
    return cy.findByLabelText('alert')
  }
}
