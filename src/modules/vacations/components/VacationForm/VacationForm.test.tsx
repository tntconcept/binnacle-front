import { waitFor } from '@testing-library/react'
import { VacationForm } from 'modules/vacations/components/VacationForm/VacationForm'
import type { VacationFormValues } from 'modules/vacations/data-access/interfaces/vacation-form-values.interface'
import React from 'react'
import SubmitButton from 'shared/components/FormFields/SubmitButton'
import { render, screen, userEvent } from 'test-utils/app-test-utils'
import { mock } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { VacationsRepository } from 'modules/vacations/data-access/repositories/vacations-repository'
import chrono from 'shared/utils/chrono'

describe('VacationForm', () => {
  test('validation runs on submit', async () => {
    setup({
      startDate: '',
      endDate: '',
      description: Array(1088)
        .fill('-')
        .join('')
    })

    userEvent.click(screen.getByRole('button', { name: 'actions.save' }))

    expect(await screen.findAllByText('form_errors.field_required')).toHaveLength(2)
    expect(screen.getByText('form_errors.max_length 1088 / 1024')).toBeInTheDocument()
  })

  test('last day of next year should be the last allowed date value', function() {
    setup({
      startDate: '',
      endDate: '',
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
      startDate: '',
      endDate: '',
      description: ''
    })

    userEvent.type(screen.getByLabelText('vacation_form.start_date'), '2100-01-02')
    userEvent.type(screen.getByLabelText('vacation_form.end_date'), '2100-01-03')

    userEvent.click(screen.getByRole('button', { name: 'actions.save' }))

    expect(await screen.findAllByText(`form_errors.year_max ${chrono().get('year') + 2}`)).toHaveLength(2)
  })

  test('validate that end date is after the start date', async () => {
    setup({
      startDate: '',
      endDate: '',
      description: ''
    })

    userEvent.type(screen.getByLabelText('vacation_form.start_date'), '2020-01-20')
    userEvent.type(screen.getByLabelText('vacation_form.end_date'), '2020-01-10')

    userEvent.click(screen.getByRole('button', { name: 'actions.save' }))
    expect(await screen.findByText('form_errors.end_date_greater')).toBeInTheDocument()
  })

  test('should fill the fields and call create action on submit', async () => {
    const { createVacationPeriodMock } = setup({
      startDate: '',
      endDate: '',
      description: ''
    })

    userEvent.type(screen.getByLabelText('vacation_form.start_date'), '2020-08-10')
    userEvent.type(screen.getByLabelText('vacation_form.end_date'), '2020-08-20')
    userEvent.type(screen.getByLabelText('vacation_form.description'), 'Lorem ipsum ...')

    userEvent.click(screen.getByRole('button', { name: 'actions.save' }))

    await waitFor(() => {
      expect(createVacationPeriodMock).toHaveBeenCalledWith({
        id: undefined,
        startDate: '2020-08-10',
        endDate: '2020-08-20',
        description: 'Lorem ipsum ...'
      })
    })
  })

  test('should have fields filled and call update action on submit', async () => {
    const { modifyVacationPeriodMock } = setup({
      id: 10,
      startDate: '2020-08-05',
      endDate: '2020-08-06',
      description: 'Lorem ipsum dolorum...'
    })

    expect(screen.getByLabelText('vacation_form.start_date')).toHaveValue('2020-08-05')
    expect(screen.getByLabelText('vacation_form.end_date')).toHaveValue('2020-08-06')
    expect(screen.getByLabelText('vacation_form.description')).toHaveValue('Lorem ipsum dolorum...')

    userEvent.click(screen.getByRole('button', { name: 'actions.save' }))

    await waitFor(() => {
      expect(modifyVacationPeriodMock).toHaveBeenCalledWith({
        id: 10,
        startDate: '2020-08-05',
        endDate: '2020-08-06',
        description: 'Lorem ipsum dolorum...'
      })
    })
  })
})

function setup(initialValues: VacationFormValues) {
  const vacationsRepository = mock<VacationsRepository>()
  container.registerInstance(VacationsRepository, vacationsRepository)
  vacationsRepository.getCorrespondingVacationDays.mockResolvedValue(0)

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
