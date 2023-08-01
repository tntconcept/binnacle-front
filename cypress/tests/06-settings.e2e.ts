import { SettingsPo } from '../page-objects/settings-po'

describe('Settings page', () => {
  it('should change the language', function () {
    cy.smartLoginTo('settings')

    cy.findByLabelText('Language').find('option:selected').should('have.text', 'English')

    SettingsPo.changeLanguage('es')
    cy.contains('Idioma').should('be.visible')

    SettingsPo.changeLanguage('en')
    cy.contains('Language').should('be.visible')
  })

  it('should change the theme', () => {
    cy.smartLoginTo('settings')

    cy.findByLabelText('Theme')
      .find('option:selected')
      .should('have.text', 'Automatic (based on system theme)')

    SettingsPo.changeTheme('Dark')
    cy.contains('Dark').should('be.visible')
  })
})
