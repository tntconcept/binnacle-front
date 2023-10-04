import AvailabilityPage from '../ui/availability-page'

describe('See users availability', () => {
  it('should not show table until filters are selected', () => {
    setup()

    cy.findByLabelText('Organization', { selector: 'input' }).should('have.value', '')

    cy.findByLabelText('User', { selector: 'input' }).should('have.value', '')

    cy.findByText('Paid leave').should('not.exist')
  })

  it('should show table when filters are selected', () => {
    setup()

    cy.findByLabelText('Organization', { selector: 'input' }).click()

    cy.findByText('Test organization').click()

    cy.findByText('Paid leave').should('be.visible')
  })
})

const setup = () => {
  cy.clock().invoke('setSystemTime', new Date(2023, 9, 1, 0, 0, 0, 0).getTime())

  cy.mount(<AvailabilityPage></AvailabilityPage>)
}
