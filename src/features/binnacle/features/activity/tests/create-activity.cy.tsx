import { ActivitiesPage } from '../ui/activities-page'
import { MemoryRouter } from 'react-router-dom'
import { TntChakraProvider } from '../../../../../shared/providers/tnt-chakra-provider'

describe('Create activity', () => {
  it('should create a new activity', async () => {
    setup()

    cy.findByTestId('show_activity_modal').click()

    //TODO change to use literal instead of translation
    cy.findByLabelText('Description').type('Hello world')

    cy.findByRole('button', { name: 'Save' }).click()

    cy.findByRole('button', { name: 'Save' }).should('not.exist')
  })
})

function setup() {
  cy.mount(
    <MemoryRouter>
      <TntChakraProvider>
        <ActivitiesPage />
      </TntChakraProvider>
    </MemoryRouter>
  )
}
