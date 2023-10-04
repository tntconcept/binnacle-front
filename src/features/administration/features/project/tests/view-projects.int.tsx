import ProjectsPage from '../ui/projects-page'

describe('View projects', () => {
  it('should not view any project if there is no organization', () => {
    setup()

    cy.findByTestId('organization_field').should('contain.text', '')

    cy.get('[data-testid="empty-desktop-view"]').should('contain.text', '')

    cy.findByText('It is necessary to filter by organization to obtain the projects.').should(
      'exist'
    )
  })

  it('should view project is organization', () => {
    setup()

    cy.findByTestId('organization_field').type('Test')
    cy.findByText('Test organization').click()

    cy.findByText('Proyecto A').should('exist')
  })

  it('should show toast after blocking project', () => {
    setup()

    cy.findByTestId('organization_field').type('Test')
    cy.findByText('Test organization').click()

    cy.findByText('Block').click()
    cy.get('form').submit()

    cy.findByText('The project has been blocked.').should('exist')
  })
})

const setup = () => {
  cy.mount(<ProjectsPage></ProjectsPage>)
}
