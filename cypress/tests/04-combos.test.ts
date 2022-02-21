describe('Combos', () => {
  let isLogged = false

  const today = new Date()

  beforeEach(() => {
    cy.clock(today, ['Date'])
    cy.intercept(/organizations/).as('getOrganizations')

    cy.smartLoginTo('binnacle').then(() => {
      isLogged = true
    })
  })

  const selectSampleNr1 = () => {
    cy.get('input[name=organization]').click()
    cy.contains('Autentia').click()

    cy.get('input[name=project]').type('tnt{downArrow}{enter}')

    cy.get('input[name=role]').click()
    cy.contains('Back-End').click()
  }

  it('should be able to select values with mouse and keyboard', () => {
    cy.contains('Activity created for end-to-end tests').click()
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

  it('show again all items', () => {
    cy.contains('Activity created for end-to-end tests').click()
    cy.contains('Add role').click()
    selectSampleNr1()

    cy.get('input[name=organization]').click()

    cy.get('ul[role=listbox] > li:lt(3)').should(($lis) => {
      expect($lis, '3 items').to.have.length(3)
      expect($lis.eq(0), 'first item').to.contain('Empresa 1')
      expect($lis.eq(1), 'second item').to.contain('Empresa 2')
      expect($lis.eq(2), 'third item').to.contain('Autentia')
    })

    cy.get('.chakra-modal__close-btn').click()
  })

  it('show combos filled if there is no recent role', () => {
    const todayMonth = new Date().getMonth()
    const prevMonth = getPrevMonth(todayMonth)
    cy.get('[data-testid=prev_month_button]').click()

    cy.contains(prevMonth).should('be.visible')

    cy.contains(/Activity 40 days before now/i).click({ force: true })
    cy.wait('@getOrganizations')

    cy.get('input[name=organization]').should('have.value', 'Empresa 2').and('not.be.disabled')
    cy.get('input[name=project]').should('have.value', 'Dashboard').and('not.be.disabled')
    cy.get('input[name=role]').should('have.value', 'React').and('not.be.disabled')

    cy.get('button[type=submit]').click({ force: true })
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

  it('fix bug: when filled, after clear, it keeps the old form value allowing to submit', () => {
    const todayMonth = new Date().getMonth()
    const prevMonth = getPrevMonth(todayMonth)

    cy.get('[data-testid=prev_month_button]').click()
    cy.contains(`${prevMonth}`).should('be.visible')

    cy.contains(/Activity 40 days before now/i).click({ force: true })
    cy.wait('@getOrganizations')

    cy.get('input[name=organization]').should('have.value', 'Empresa 2')
    cy.get('input[name=project]').should('have.value', 'Dashboard')
    cy.get('input[name=role]').should('have.value', 'React')

    cy.get('input[name=organization]').clear()
    cy.contains('Select an option').should('not.exist')

    cy.get('button[type=submit]').click({ force: true })

    cy.findByText(/Select an option/i).should('be.visible')

    cy.get('.chakra-modal__close-btn').click()
  })
})

function getPrevMonth(actual: number): string {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  return actual > 1 ? monthNames[actual - 1] : monthNames[actual]
}
