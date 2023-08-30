import ActivitiesPage from '../ui/activities-page'

describe('Create activity', () => {
  it('should create a new activity', () => {
    setup()
    cy.findByTestId('show_activity_modal').click()
    cy.findByLabelText('Description').type('Hello world')
    cy.findByRole('button', { name: 'Save' }).click()

    cy.findByText('Billable project').should('exist')
  })

  it('should create a new activity using tab', () => {
    setup()
    cy.findByTestId('show_activity_modal').click()
    cy.get('[data-testid="startTime_field"]').clear()
    cy.get('[data-testid="startTime_field"]').type('12:0')
    cy.get('[data-testid="endTime_field"]').clear()
    cy.get('[data-testid="endTime_field"]').type('15')

    cy.findByLabelText('Description').type('Hello world', { force: true })

    cy.findByRole('button', { name: 'Save' }).click()

    cy.findAllByText('Billable project').should('have.length', 2)
  })
})

function setup() {
  cy.mount(<ActivitiesPage />)
}
