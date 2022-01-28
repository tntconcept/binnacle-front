import SettingsPO from '../page-objects/SettingsPO'

describe('Settings page', () => {
  it('should change the language', function() {
    cy.smartLoginTo('settings')

    cy.findByLabelText('Language')
      .find('option:selected')
      .should('have.text', 'English')

    SettingsPO.changeLanguage('es')
    cy.contains('Idioma').should('be.visible')

    SettingsPO.changeLanguage('en')
    cy.contains('Language').should('be.visible')
  })
})
