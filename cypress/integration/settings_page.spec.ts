import SettingsPO from '../page_objects/SettingsPO'

context('Settings page', () => {
  it('should change the language', function() {
    cy.smartLoginTo('settings')

    cy.contains('English')
      .get('input')
      .should('be.checked')

    SettingsPO.changeLanguage('es')
    cy.contains('Idioma').should('be.visible')

    SettingsPO.changeLanguage('en')
    cy.contains('Language').should('be.visible')
  })
})
