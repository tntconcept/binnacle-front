import { ActivityFilterForm } from './activity-filter-form'
import { chrono } from '../../../../../../../../../shared/utils/chrono'
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent
} from '../../../../../../../../../test-utils/render'

describe('ActivityFilterForm', () => {
  it('should set default form values', () => {
    setup()
    const startDate = screen.getByLabelText('activity_form.start_date')
    const endDate = screen.getByLabelText('activity_form.end_date')
    expect(startDate).toHaveValue('2022-10-10')
    expect(endDate).toHaveValue('2022-10-10')
  })

  it('should call onFiltersChange when there is a change', async () => {
    const { onFiltersChangeSpy } = setup()
    const startDate = screen.getByLabelText('activity_form.start_date')

    act(() => {
      fireEvent.change(startDate, { target: { value: '2020-10-15' } })
    })

    await waitFor(() => {
      expect(onFiltersChangeSpy).toHaveBeenCalledTimes(1)
    })

    expect(onFiltersChangeSpy).toHaveBeenCalledWith(
      chrono('2020-10-15').getDate(),
      chrono('2022-10-10').getDate()
    )
  })

  it('should show error when startDate is greater than endDate', async () => {
    const { onFiltersChangeSpy } = setup()
    const startDate = screen.getByLabelText('activity_form.start_date')

    act(() => {
      fireEvent.change(startDate, { target: { value: '2025-10-15' } })
    })

    expect(onFiltersChangeSpy).toHaveBeenCalledTimes(0)
    await waitFor(() => {
      expect(screen.getByText('form_errors.end_date_greater')).toBeInTheDocument()
    })
  })

  it('should show error when startDate input is empty', async () => {
    const { onFiltersChangeSpy } = setup()
    const startDate = screen.getByLabelText('activity_form.start_date')

    act(() => {
      fireEvent.change(startDate, { target: { value: '' } })
    })

    await waitFor(() => {
      expect(onFiltersChangeSpy).toHaveBeenCalledTimes(0)
    })

    const error = screen.getByText('form_errors.field_required')

    expect(error).not.toBeUndefined()
  })

  it('should show error when endDate input is empty', async () => {
    const { onFiltersChangeSpy } = setup()
    const endDate = screen.getByLabelText('activity_form.end_date')

    act(() => {
      fireEvent.change(endDate, { target: { value: '' } })
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
    start: new Date('2022-10-10'),
    end: new Date('2022-10-10')
  }

  const onFiltersChangeSpy = jest.fn()
  render(<ActivityFilterForm filters={filters} onFiltersChange={onFiltersChangeSpy} />)

  return { onFiltersChangeSpy }
}
