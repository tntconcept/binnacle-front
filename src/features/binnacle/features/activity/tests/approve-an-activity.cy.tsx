import PendingActivitiesPage from '../ui/pending-activities-page'

describe('Approve activity', () => {
  it('should not be able to approve an activity without evidence', () => {
    setup()

    cy.findByTestId('show_activity_1').click()

    cy.findByTestId('approve_activity_1').should('be.disabled')
  })
})

function setup() {
  cy.mount(<PendingActivitiesPage />)
}
