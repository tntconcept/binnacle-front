import ActivitiesPage from '../ui/activities-page'

describe('Change billable type activity', () => {
  it('should put not billable when no billable project', () => {
    setup()
    cy.findByTestId('show_activity_modal').click()
    cy.findByRole('button', { name: 'Add role' }).click()
    cy.findByTestId('organization_field').type('Test organization\n')
    cy.findByTestId('project_field').type('Proyecto C\n')

    cy.findByText('No billable').should('exist')
  })

  it('should closed price when billable project', () => {
    setup()
    cy.findByTestId('show_activity_modal').click()
    cy.findByRole('button', { name: 'Add role' }).click()
    cy.findByTestId('organization_field').type('Test organization\n')
    cy.findByTestId('project_field').type('Proyecto B\n')

    cy.findByText('Closed price').should('exist')
  })

  it('should change billable field when billable project', () => {
    setup()
    cy.findByTestId('show_activity_modal').click()
    cy.findByRole('button', { name: 'Add role' }).click()
    cy.findByTestId('organization_field').type('Test organization\n')
    cy.findByTestId('project_field').type('Proyecto A\n')

    cy.findByText('Billable').should('exist')
  })
})

function setup() {
  cy.mount(<ActivitiesPage />)
}
