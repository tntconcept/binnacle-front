import PendingActivitiesPage from '../ui/pending-activities-page'

describe('Approve activity', () => {
  it('should be able to approve an activity', () => {
    setup()

    cy.findByTestId('show_activity_1').click()
    cy.findByTestId('approve_activity_1').click()
    cy.findByTestId('activity_state_filter').select('ACCEPTED')

    cy.findAllByText('Approved').should('have.length', 2)
  })

  it("should not be able to approve an activity if it can't", () => {
    setup()

    cy.findByTestId('show_activity_2').click()
    cy.findByTestId('approve_activity_2').should('be.disabled')
  })
})

function setup() {
  cy.mount(<PendingActivitiesPage />)
}
