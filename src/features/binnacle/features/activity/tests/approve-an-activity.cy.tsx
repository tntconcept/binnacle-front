import { MemoryRouter } from 'react-router-dom'
import { TntChakraProvider } from '../../../../../shared/providers/tnt-chakra-provider'
import { PendingActivitiesPage } from '../ui/pending-activities-page'

describe('Approve activity', () => {
  it('should approve an activity', () => {
    setup()

    cy.findByRole('button', { name: 'Save' }).click()
  })
})

function setup() {
  cy.mount(
    <MemoryRouter>
      <TntChakraProvider>
        <PendingActivitiesPage />
      </TntChakraProvider>
    </MemoryRouter>
  )
}
