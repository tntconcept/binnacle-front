import { render, screen, userEvent } from 'test-utils/app-test-utils'
import { ActivitiesPage } from '../ui/activities-page'

describe('Create activity', () => {
  it('should open new activity modal', async () => {
    setup()

    userEvent.click(screen.getByTestId('show_activity_modal'))

    expect(await screen.findByText('activity_form.description')).toBeInTheDocument()
  })
})

function setup() {
  render(<ActivitiesPage />)
}
