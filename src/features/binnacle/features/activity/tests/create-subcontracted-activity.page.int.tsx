import SubcontractedActivitiesPage from '../ui/subcontracted-activities-page'
describe('Create subcontracted activity', () => {
  it('should create a new subcontracted activity', () => {
    setup()
    cy.findByTestId('show_activity_modal').click()
    cy.findByLabelText('Description').type('Hello world')
    cy.findByTestId('organization_field').type('Test organization\n')
    cy.findByTestId('project_field').type('Proyecto A\n')
    cy.findByTestId('projectRole_field').type('Project in minutes 3\n')
    cy.findByLabelText('Month').type('2024-11', { force: true })
    cy.findByLabelText('Duration (Hours)').type('6')

    cy.findByRole('button', { name: 'Save' }).click()

    cy.findByText('Project in minutes 3').should('exist')
  })
})

function setup() {
  cy.mount(<SubcontractedActivitiesPage />)
}
