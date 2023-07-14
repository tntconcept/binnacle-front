import { screen, userEvent } from 'test-utils/app-test-utils'
import { ActivitiesPage } from '../ui/activities-page'
import { MemoryRouter } from 'react-router-dom'
import { act } from '@testing-library/react'

describe('Create activity', () => {
  it('should create a new activity', async () => {
    setup()
    userEvent.click(screen.getByTestId('show_activity_modal'))

    act(() => {
      userEvent.click(screen.getByRole('button', { name: 'activity.create' }))
    })

    userEvent.type(screen.getByLabelText('activity_form.start_date'), '2021-10-10')
    userEvent.type(screen.getByLabelText('activity_form.end_date'), '2021-10-10')
    userEvent.type(screen.getByLabelText('activity_form.description'), 'Description')
  })
})

function setup() {
  cy.mount(
    <MemoryRouter>
      <ActivitiesPage />
    </MemoryRouter>
  )
}
