class SettingsPO {
  static changeLanguage(language: 'en' | 'es') {
    cy.get('#language').select(language)
  }

  static changeTheme(language: 'Light' | 'Dark') {
    cy.get('#theme').select(language)
  }

  static changeStartWorkingTime(value: string) {
    cy.get('[data-testid=startWorkingTime]').clear().type(value)
  }

  static changeEndWorkingTime(value: string) {
    cy.get('[data-testid=endWorkingTime]').clear().type(value)
  }

  static changeStartLunchBreak(value: string) {
    cy.get('[data-testid=startLunchBreak]').clear().type(value)
  }

  static changeEndLunchBreak(value: string) {
    cy.get('[data-testid=endLunchBreak]').clear().type(value)
  }

  static toggleAutoFillHours() {
    cy.contains('Autofill hours').click()
  }

  static toggleShowDurationInput() {
    cy.contains('Show duration input in the activity form').click()
  }

  static toggleDecimalFormat() {
    cy.contains('Use the decimal format to format hours').click()
  }
}

export default SettingsPO
