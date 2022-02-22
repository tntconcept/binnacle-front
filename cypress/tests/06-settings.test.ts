import SettingsPO from '../page-objects/SettingsPO'

describe('Settings page', () => {
  it('should change the language', function () {
    cy.smartLoginTo('settings')

    cy.findByLabelText('Language').find('option:selected').should('have.text', 'English')

    SettingsPO.changeLanguage('es')
    cy.contains('Idioma').should('be.visible')

    SettingsPO.changeLanguage('en')
    cy.contains('Language').should('be.visible')
  })

  it('should change the theme', async () => {
    cy.smartLoginTo('settings')

    cy.findByLabelText('Theme')
      .find('option:selected')
      .should('have.text', 'Automatic (based on system theme)')

    SettingsPO.changeTheme('Dark')
    cy.contains('Dark').should('be.visible')
  })
})
