import VacationsPage from '../ui/vacations-page'

describe('Create new vacation', () => {
  it('should create a vacation', () => {
    setup()
    cy.findByText('New vacation period').click()
    cy.findByLabelText('Description').type('Hello world')
    cy.findByRole('button', { name: 'Save' }).click()

    cy.findByText('Hello world').should('exist')
  })
})

const setup = () => {
  cy.mount(<VacationsPage></VacationsPage>)
}
