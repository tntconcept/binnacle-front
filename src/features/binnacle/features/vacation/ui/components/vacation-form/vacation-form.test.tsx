import { SubmitButton } from '../../../../../../../shared/components/form-fields/submit-button'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { act, render, screen, userEvent, waitFor } from '../../../../../../../test-utils/render'
import { NewVacation } from '../../../domain/new-vacation'
import { UpdateVacation } from '../../../domain/update-vacation'
import { VacationForm } from './vacation-form'

jest.mock('./working-days', () => {
  return {
    WorkingDays: () => <div>WorkingDays</div>,
    __esModule: true
  }
})

describe('VacationForm', () => {
  test('validate that date range is between the max year validation', async () => {
    setup({
      startDate: new Date('2020-08-05'),
      endDate: new Date('2020-08-05'),
      description: ''
    })

    await act(async () => {
      const startDate = screen.getByLabelText('vacation_form.start_date')
      await userEvent.clear(startDate)
      await userEvent.type(startDate, '2100-01-02')
      await userEvent.type(screen.getByLabelText('vacation_form.end_date'), '2100-01-03')

      await userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
    })

    expect(screen.getByText(`form_errors.year_max ${chrono().get('year') + 2}`)).toBeInTheDocument()
  })

  test('should check that when the start date is after the end date, the end date is set equal to the start date on start date changes', async () => {
    const initialValues: UpdateVacation = {
      id: 10,
      startDate: new Date('2020-08-05'),
      endDate: new Date('2020-08-06'),
      description: 'Lorem ipsum dolorum...'
    }
    const { modifyVacationPeriodMock } = setup(initialValues)

    await act(async () => {
      const startDate = screen.getByLabelText('vacation_form.start_date')
      await userEvent.clear(startDate)
      await userEvent.type(startDate, '2020-09-22')
      await userEvent.tab()
    })

    await waitFor(() => {
      expect(screen.getByLabelText('vacation_form.start_date')).toHaveValue('2020-09-22')
      expect(screen.getByLabelText('vacation_form.end_date')).toHaveValue('2020-09-22')
      expect(screen.getByLabelText('vacation_form.description')).toHaveValue(
        'Lorem ipsum dolorum...'
      )
    })

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
    })

    await waitFor(() => {
      expect(modifyVacationPeriodMock).toHaveBeenCalledWith({
        id: 10,
        startDate: chrono(new Date('2020-09-22')).minus(2, 'hour').getDate(),
        endDate: chrono(new Date('2020-09-22')).minus(2, 'hour').getDate(),
        description: 'Lorem ipsum dolorum...'
      })
    })
  })

  test('should check that when the start date is after the end date, the start date is set equal to the end date on end date changes', async () => {
    const { modifyVacationPeriodMock } = setup({
      id: 10,
      startDate: new Date('2020-08-05'),
      endDate: new Date('2020-08-06'),
      description: 'Lorem ipsum dolorum...'
    })

    await act(async () => {
      const endDate = screen.getByLabelText('vacation_form.end_date')
      await userEvent.clear(endDate)
      await userEvent.type(endDate, '2020-08-01')
      await userEvent.tab()
    })

    await waitFor(() => {
      expect(screen.getByLabelText('vacation_form.start_date')).toHaveValue('2020-08-01')
      expect(screen.getByLabelText('vacation_form.end_date')).toHaveValue('2020-08-01')
      expect(screen.getByLabelText('vacation_form.description')).toHaveValue(
        'Lorem ipsum dolorum...'
      )
    })

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
    })

    await waitFor(() => {
      expect(modifyVacationPeriodMock).toHaveBeenCalledWith({
        id: 10,
        startDate: chrono(new Date('2020-08-01')).minus(2, 'hour').getDate(),
        endDate: chrono(new Date('2020-08-01')).minus(2, 'hour').getDate(),
        description: 'Lorem ipsum dolorum...'
      })
    })
  })

  test('should fill the fields and call create action on submit', async () => {
    const { createVacationPeriodMock } = setup({
      startDate: new Date('2020-08-05'),
      endDate: new Date('2020-08-05'),
      description: ''
    })

    await act(async () => {
      const startDate = screen.getByLabelText('vacation_form.start_date')
      const endDate = screen.getByLabelText('vacation_form.end_date')
      await userEvent.clear(startDate)
      await userEvent.clear(endDate)

      await userEvent.type(startDate, '2020-08-10')
      await userEvent.type(endDate, '2020-08-20')
      await userEvent.type(screen.getByLabelText('vacation_form.description'), 'Lorem ipsum ...')

      await userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
    })

    await waitFor(() => {
      expect(createVacationPeriodMock).toHaveBeenCalledWith({
        id: undefined,
        startDate: chrono(new Date('2020-08-10')).minus(2, 'hour').getDate(),
        endDate: chrono(new Date('2020-08-20')).minus(2, 'hour').getDate(),
        description: 'Lorem ipsum ...'
      })
    })
  })

  test('should have fields filled and call update action on submit', async () => {
    const { modifyVacationPeriodMock } = setup({
      id: 10,
      startDate: new Date('2020-08-05'),
      endDate: new Date('2020-08-06'),
      description: 'Lorem ipsum dolorum...'
    })

    expect(screen.getByLabelText('vacation_form.start_date')).toHaveValue('2020-08-05')
    expect(screen.getByLabelText('vacation_form.end_date')).toHaveValue('2020-08-06')
    expect(screen.getByLabelText('vacation_form.description')).toHaveValue('Lorem ipsum dolorum...')

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
    })

    await waitFor(() => {
      expect(modifyVacationPeriodMock).toHaveBeenCalledWith({
        id: 10,
        startDate: chrono(new Date('2020-08-05')).minus(2, 'hour').getDate(),
        endDate: chrono(new Date('2020-08-06')).minus(2, 'hour').getDate(),
        description: 'Lorem ipsum dolorum...'
      })
    })
  })
})

function setup(initialValues: NewVacation | UpdateVacation) {
  const createVacationPeriodMock = jest.fn()
  const modifyVacationPeriodMock = jest.fn()

  const VacationFormContainer = () => {
    return (
      <div>
        <VacationForm
          values={initialValues}
          createVacationPeriod={createVacationPeriodMock}
          updateVacationPeriod={modifyVacationPeriodMock}
        />
        <SubmitButton formId="vacation-form">actions.save</SubmitButton>
      </div>
    )
  }

  const renderResult = render(<VacationFormContainer />)

  return {
    createVacationPeriodMock,
    modifyVacationPeriodMock,
    ...renderResult
  }
}
