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

  it('should create a new subcontracted activity setting first part of time input only and doing blur on them', () => {
    setup()
    cy.findByTestId('show_activity_modal').click()
    cy.findByTestId('organization_field').type('New Test organization\n')
    cy.findByTestId('project_field').type('Proyecto A\n')
    cy.findByTestId('projectRole_field').type('Project in minutes 3\n')
    cy.findByLabelText('Month').clear()
    cy.findByLabelText('Month').type('2024-12')
    cy.findByLabelText('Duration (Hours)').clear()
    cy.findByLabelText('Duration (Hours)').type('300')

    cy.findByLabelText('Description').type('Hello world', { force: true })

    cy.findByRole('button', { name: 'Save' }).click()

    cy.findAllByText('Project in minutes 3').should('have.length', 2)
  })
})

function setup() {
  cy.mount(<SubcontractedActivitiesPage />)
}
