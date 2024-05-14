import SubcontractedActivitiesPage from '../ui/subcontracted-activities-page'
describe('Delete subcontracted activity', () => {
  it('should update a new subcontracted activity', () => {
    setup()
    cy.findAllByText('No billable project').should('have.length', 3)
    cy.contains('Remove').click()
    cy.findByText('Remove activity').click()
    cy.findAllByText('No billable project').should('have.length', 2)
  })
})

function setup() {
  cy.mount(<SubcontractedActivitiesPage />)
}
