describe('Combos', () => {
  const today = new Date()

  beforeEach(() => {
    cy.clock(today, ['Date'])
    cy.resetDatabase().then(() => cy.smartLoginTo('binnacle'))

    cy.intercept(/organizations/).as('getOrganizations')
    cy.intercept(/activities/).as('getActivities')
  })

  const selectSampleNr1 = () => {
    cy.get('input[name=organization]').click()
    cy.contains('Autentia').click()

    cy.get('input[name=project]')
    cy.click()
    cy.type('{downArrow}{downArrow}{enter}')

    cy.get('input[name=role]').click()
    cy.contains('Back-End').click()
  }

  it('should be able to select values with mouse and keyboard', () => {
    cy.contains('10:00 - 11:00 Activity created for end-to-end tests').click()
    cy.contains('Add role').click()
    cy.wait('@getOrganizations')

    selectSampleNr1()

    cy.get('button[type=submit]').click({ force: true })

    cy.contains('Select an option').should('not.exist')

    cy.get('.chakra-modal__close-btn').click()
  })

  it('resets project and role when organization is changed', () => {
    cy.contains('Activity created for end-to-end tests').click()
    cy.contains('Add role').click()
    cy.wait('@getOrganizations')

    selectSampleNr1()

    cy.get('input[name=organization]').clear()
    cy.get('input[name=project]').should('be.disabled').and('be.empty')
    cy.get('input[name=role]').should('be.disabled').and('be.empty')

    cy.get('.chakra-modal__close-btn').click()
  })

  it('resets project and role errors when organization is changed', () => {
    cy.contains('Activity created for end-to-end tests').click()
    cy.contains('Add role').click()
    cy.wait('@getOrganizations')

    selectSampleNr1()

    cy.get('input[name=organization]').clear()

    cy.get('button[type=submit]').click({ force: true })
    cy.contains('Select an option').should('have.length', 1)

    cy.get('input[name=organization]').click()
    cy.contains('Autentia').click()

    cy.contains('Select an option').should('not.exist')

    cy.get('input[name=project]').click()
    cy.contains('TNT').click()

    cy.contains('Select an option').should('not.exist')

    cy.get('.chakra-modal__close-btn').click()
  })

  it('resets role when project is changed', () => {
    cy.contains('Activity created for end-to-end tests').click()
    cy.contains('Add role').click()
    cy.wait('@getOrganizations')

    selectSampleNr1()

    cy.get('input[name=project]').clear()
    cy.get('input[name=role]').should('be.disabled').and('be.empty')

    cy.get('.chakra-modal__close-btn').click()
  })

  it('resets role errors when project is changed', () => {
    cy.contains('Activity created for end-to-end tests').click()
    cy.contains('Add role').click()
    cy.wait('@getOrganizations')

    selectSampleNr1()

    cy.get('input[name=project]').clear()

    cy.get('button[type=submit]').click({ force: true })
    cy.contains('Select an option').should('have.length', 1)

    cy.get('input[name=project]').click()
    cy.contains('TNT').click()

    cy.contains('Select an option').should('not.exist')
    cy.get('.chakra-modal__close-btn').click()
  })

  it('should display combos empty on add role when there is a recent role', () => {
    cy.contains('Activity created for end-to-end tests').click()
    cy.contains('Add role').click()

    cy.get('input[name=organization]').should('be.empty')
    cy.get('input[name=project]').should('be.empty')
    cy.get('input[name=role]').should('be.empty')

    cy.get('button[type=submit]').click({ force: true })
    cy.get('.chakra-modal__close-btn').click()
  })
})

export {}
