import PendingActivitiesPage from '../ui/pending-activities-page'

describe('See activity evidence', () => {
  it('should be able to approve an activity', () => {
    setup()

    cy.stub(window, 'open')

    cy.findByTestId('evidence_0').click()

    cy.window().its('open').should('be.called')
  })
})

function setup() {
  cy.mount(<PendingActivitiesPage />)
}
