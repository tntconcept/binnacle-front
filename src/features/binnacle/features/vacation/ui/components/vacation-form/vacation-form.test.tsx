import { waitFor } from '@testing-library/react'
import { render, screen, userEvent } from 'test-utils/app-test-utils'
import { chrono } from 'shared/utils/chrono'
import { SubmitButton } from 'shared/components/form-fields/submit-button'
import { VacationForm } from './vacation-form'
import { NewVacation } from '../../../domain/new-vacation'
import { UpdateVacation } from '../../../domain/update-vacation'
import { act } from 'react-dom/test-utils'

// eslint-disable-next-line react/display-name
jest.mock('./working-days', () => () => {
  return <p>mock</p>
})

describe('VacationForm', () => {
  test('last day of next year should be the last allowed date value', function () {
    setup({
      startDate: new Date('2020-08-05'),
      endDate: new Date('2020-08-05'),
      description: ''
    })

    const maxYear = chrono().get('year') + 1
    expect(screen.getByLabelText('vacation_form.start_date')).toHaveAttribute(
      'max',
      `${maxYear}-12-31`
    )
    expect(screen.getByLabelText('vacation_form.end_date')).toHaveAttribute(
      'max',
      `${maxYear}-12-31`
    )
  })

  test('validate that date range is between the max year validation', async () => {
    setup({
      startDate: new Date('2020-08-05'),
      endDate: new Date('2020-08-05'),
      description: ''
    })

    act(() => {
      userEvent.type(screen.getByLabelText('vacation_form.start_date'), '2100-01-02')
      userEvent.type(screen.getByLabelText('vacation_form.end_date'), '2100-01-03')

      userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
    })

    expect(
      await screen.findAllByText(`form_errors.year_max ${chrono().get('year') + 2}`)
    ).toHaveLength(2)
  })

  test('should check that when the start date is after the end date, the end date is set equal to the start date on start date changes', async () => {
    const initialValues: UpdateVacation = {
      id: 10,
      startDate: new Date('2020-08-05'),
      endDate: new Date('2020-08-06'),
      description: 'Lorem ipsum dolorum...'
    }
    const { modifyVacationPeriodMock } = setup(initialValues)

    act(() => {
      userEvent.type(screen.getByLabelText('vacation_form.start_date'), '2020-09-22')
      userEvent.tab()
    })

    await waitFor(() => {
      expect(screen.getByLabelText('vacation_form.start_date')).toHaveValue('2020-09-22')
      expect(screen.getByLabelText('vacation_form.end_date')).toHaveValue('2020-09-22')
      expect(screen.getByLabelText('vacation_form.description')).toHaveValue(
        'Lorem ipsum dolorum...'
      )
    })

    userEvent.click(screen.getByRole('button', { name: 'actions.save' }))

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

    act(() => {
      userEvent.type(screen.getByLabelText('vacation_form.end_date'), '2020-08-01')
      userEvent.tab()
    })

    await waitFor(() => {
      expect(screen.getByLabelText('vacation_form.start_date')).toHaveValue('2020-08-01')
      expect(screen.getByLabelText('vacation_form.end_date')).toHaveValue('2020-08-01')
      expect(screen.getByLabelText('vacation_form.description')).toHaveValue(
        'Lorem ipsum dolorum...'
      )
    })

    userEvent.click(screen.getByRole('button', { name: 'actions.save' }))

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

    act(() => {
      userEvent.type(screen.getByLabelText('vacation_form.start_date'), '2020-08-10')
      userEvent.type(screen.getByLabelText('vacation_form.end_date'), '2020-08-20')
      userEvent.type(screen.getByLabelText('vacation_form.description'), 'Lorem ipsum ...')

      userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
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

    act(() => {
      userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
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

  render(<VacationFormContainer />)

  return {
    createVacationPeriodMock,
    modifyVacationPeriodMock
  }
}
