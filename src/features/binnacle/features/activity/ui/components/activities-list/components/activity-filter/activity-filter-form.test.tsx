import { act, render, screen } from '@testing-library/react'
import { ActivityFilterForm } from './activity-filter-form'
import userEvent from '@testing-library/user-event'

describe('ActivityFilterForm', () => {
  const setup = () => {
    const filters = {
      start: new Date(),
      end: new Date()
    }
    render(
      <ActivityFilterForm
        filters={filters}
        onFiltersChange={async (startDate, endDate) => {
          console.log(startDate, endDate)
        }}
      />
    )
  }

  it('should render', () => {
    setup()
    expect(screen.getByLabelText('activity_form.start_date')).not.toBeUndefined()
    expect(screen.getByLabelText('activity_form.end_date')).not.toBeUndefined()
  })

  it('should call onFiltersChange when there is a change', async () => {
    setup()
    const field = screen.getByTestId('startDate_field')
    act(async () => {
      userEvent.type(field, '2022-10-10')
    })
    expect(field).toHaveValue('2022-10-10')
  })
})
