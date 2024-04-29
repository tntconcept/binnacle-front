import SubcontractedActivitiesPage from '../ui/subcontracted-activities-page'
describe('Update subcontracted activity', () => {
  it('should update a subcontracted activity', () => {
    setup()
    cy.contains('Edit').click()
    cy.findByLabelText('Description').type('Hello world')
    cy.findByTestId('organization_field').clear()
    cy.findByTestId('organization_field').type('New Test organization\n')
    cy.findByTestId('project_field').type('Proyecto B\n')
    cy.findByTestId('projectRole_field').type('Project in minutes\n')
    cy.findByLabelText('Month').clear()
    cy.findByLabelText('Month').type('2024-07', { force: true })
    cy.findByLabelText('Duration (Hours)').clear()
    cy.findByLabelText('Duration (Hours)').type('10.5')
    cy.findByRole('button', { name: 'Save' }).click()

    cy.findByText('10.5h').should('exist')
    cy.findByText('2024-07').should('exist')
  })
})

function setup() {
  cy.mount(<SubcontractedActivitiesPage />)
}
