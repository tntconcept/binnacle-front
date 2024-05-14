import { SubcontractedActivityFilterForm } from './subcontracted-activity-filter-form'
import { chrono } from '../../../../../../../../../shared/utils/chrono'
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
  userEvent
} from '../../../../../../../../../test-utils/render'

describe('SubcontractedActivityFilterForm', () => {
  it('should set default form values', () => {
    setup()
    const startDate = screen.getByLabelText('subcontracted_activity_form.start_date')
    const endDate = screen.getByLabelText('subcontracted_activity_form.end_date')
    expect(startDate).toHaveValue('2024-02')
    expect(endDate).toHaveValue('2024-04')
  })

  it('should call onFiltersChange when there is a change', async () => {
    const { onFiltersChangeSpy } = setup()
    const startDate = screen.getByLabelText('subcontracted_activity_form.start_date')

    act(() => {
      fireEvent.change(startDate, { target: { value: '2024-04' } })
    })

    await waitFor(() => {
      expect(onFiltersChangeSpy).toHaveBeenCalledTimes(1)
    })

    expect(onFiltersChangeSpy).toHaveBeenCalledWith(
      chrono('2024-04-01').getDate(),
      chrono('2024-04-01').getDate()
    )
  })

  it('should show error when startDate is greater than endDate', async () => {
    const { onFiltersChangeSpy } = setup()
    const startDate = screen.getByLabelText('subcontracted_activity_form.start_date')

    act(() => {
      fireEvent.change(startDate, { target: { value: '2024-06-01' } })
    })

    expect(onFiltersChangeSpy).toHaveBeenCalledTimes(0)
    await waitFor(() => {
      expect(screen.getByText('form_errors.end_date_greater')).toBeInTheDocument()
    })
  })

  it('should show error when startDate input is empty', async () => {
    const { onFiltersChangeSpy } = setup()
    const startDate = screen.getByLabelText('subcontracted_activity_form.start_date')

    act(() => {
      userEvent.clear(startDate)
    })

    await waitFor(() => {
      expect(onFiltersChangeSpy).toHaveBeenCalledTimes(0)
    })

    const error = await screen.findByText('form_errors.field_required')

    expect(error).not.toBeUndefined()
  })

  it('should show error when endDate input is empty', async () => {
    const { onFiltersChangeSpy } = setup()
    const endDate = screen.getByLabelText('subcontracted_activity_form.end_date')

    await act(async () => {
      await userEvent.clear(endDate)
    })

    await waitFor(() => {
      expect(onFiltersChangeSpy).toHaveBeenCalledTimes(0)
    })

    const error = screen.getByText('form_errors.field_required')

    expect(error).not.toBeUndefined()
  })
})

function setup() {
  const filters = {
    start: new Date('2024-02-01'),
    end: new Date('2024-04-01')
  }

  const onFiltersChangeSpy = jest.fn()
  render(<SubcontractedActivityFilterForm filters={filters} onFiltersChange={onFiltersChangeSpy} />)

  return { onFiltersChangeSpy }
}
