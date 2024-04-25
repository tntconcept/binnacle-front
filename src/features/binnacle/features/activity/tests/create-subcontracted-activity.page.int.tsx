import SubcontractedActivitiesPage from '../ui/subcontracted-activities-page'
describe('Create subcontracted activity', () => {
  it('should create a new subcontracted activity', () => {
    setup()
    cy.findByTestId('show_activity_modal').click()
    cy.findByLabelText('Descripción').type('Hello world')
    cy.findByTestId('organization_field').type('Test organization\n')
    cy.findByTestId('project_field').type('Proyecto A\n')
    cy.findByTestId('projectRole_field').type('Project in minutes\n')
    cy.findByLabelText('Mes').type('2024-11', { force: true })
    cy.findByLabelText('Duración (Horas)').type('6')
    cy.findByRole('button', { name: 'Guardar' }).click()

    cy.findByText('Billable project').should('exist')
  })

  it('should create a new subcontracted activity setting first part of time input only and doing blur on them', () => {
    setup()
    cy.findByTestId('show_activity_modal').click()
    cy.findByText('month_field').clear()
    cy.findByText('month_field').type('2024-11')
    cy.findByText('duration_field').clear()
    cy.findByText('duration_field').type('300')

    cy.findByLabelText('Description').type('Hello world', { force: true })

    cy.findByRole('button', { name: 'Save' }).click()

    cy.findAllByText('Billable project').should('have.length', 2)
  })
})

function setup() {
  cy.mount(<SubcontractedActivitiesPage />)
}
