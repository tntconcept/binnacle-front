import ActivitiesPage from '../ui/activities-page'

describe('Create activity', () => {
  it('should create a new activity', () => {
    setup()
    cy.findByTestId('show_activity_modal').click()
    cy.findByLabelText('Description').type('Hello world')
    cy.findByRole('button', { name: 'Save' }).click()

    cy.findByText('Billable project').should('exist')
  })
})

function setup() {
  cy.mount(<ActivitiesPage />)
}
