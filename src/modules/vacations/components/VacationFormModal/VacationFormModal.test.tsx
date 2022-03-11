import { waitFor } from '@testing-library/react'
import { mock } from 'jest-mock-extended'
import { VacationForm } from 'modules/vacations/components/VacationForm/VacationForm'
import { VacationFormModal } from 'modules/vacations/components/VacationFormModal/VacationFormModal'
import { CreateVacationPeriodAction } from 'modules/vacations/data-access/actions/create-vacation-period-action'
import { UpdateVacationPeriodAction } from 'modules/vacations/data-access/actions/update-vacation-period-action'
import type { VacationFormValues } from 'modules/vacations/data-access/interfaces/vacation-form-values.interface'
import React from 'react'
import {
  createAxiosError,
  ExtractComponentProps,
  render,
  screen,
  userEvent,
  waitForNotification
} from 'test-utils/app-test-utils'
import { container } from 'tsyringe'

jest.mock('modules/vacations/components/VacationForm/VacationForm', () => ({
  VacationForm: (props: ExtractComponentProps<typeof VacationForm>) => {
    return (
      <div>
        <button onClick={() => props.createVacationPeriod(props.values)}>create action</button>
        <button onClick={() => props.updateVacationPeriod(props.values as any)}>
          update action
        </button>
      </div>
    )
  }
}))

describe('VacationFormModal', () => {
  it('should be hidden', function () {
    setup({ isOpen: false })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should close the modal clicking on the close button', function () {
    const { onClose } = setup()

    userEvent.click(screen.getByLabelText('actions.close'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should handle create vacation period and close on success', async () => {
    const initialValues: VacationFormValues = {
      id: undefined,
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: ''
    }

    const createVacationPeriodAction = mock<CreateVacationPeriodAction>()
    container.registerInstance(CreateVacationPeriodAction, createVacationPeriodAction)

    createVacationPeriodAction.execute.mockResolvedValue()

    const { onClose } = setup({
      initialValues
    })

    userEvent.click(screen.getByText('create action'))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
      expect(createVacationPeriodAction.execute).toHaveBeenCalledWith(initialValues)
    })
  })

  it('should handle update vacation period and close on success', async () => {
    const initialValues: VacationFormValues & { id: number } = {
      id: 200,
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: 'update action'
    }

    const updateVacationPeriodAction = mock<UpdateVacationPeriodAction>()
    container.registerInstance(UpdateVacationPeriodAction, updateVacationPeriodAction)

    updateVacationPeriodAction.execute.mockResolvedValue()

    const { onClose } = setup({
      initialValues
    })

    userEvent.click(screen.getByText('update action'))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
      expect(updateVacationPeriodAction.execute).toHaveBeenCalledWith(initialValues)
    })
  })

  it('should handle create vacation period and NOT close on notification error', async () => {
    const initialValues: VacationFormValues = {
      id: undefined,
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: ''
    }

    const createVacationPeriodAction = mock<CreateVacationPeriodAction>()
    container.registerInstance(CreateVacationPeriodAction, createVacationPeriodAction)

    createVacationPeriodAction.execute.mockRejectedValue(
      createAxiosError(400, { data: { code: 'INVALID_NEXT_YEAR_VACATION_DAYS_REQUEST' } })
    )

    const { onClose } = setup({
      initialValues
    })

    userEvent.click(screen.getByText('create action'))

    await waitFor(() => {
      expect(createVacationPeriodAction.execute).toHaveBeenCalledWith(initialValues)
      expect(onClose).not.toHaveBeenCalled()
    })

    await waitForNotification({
      title: 'vacation.error_max_vacation_days_requested_next_year_title',
      description: 'vacation.error_max_vacation_days_requested_next_year_message'
    })
  })

  it('should handle update vacation period and NOT close on notification error', async () => {
    const initialValues: VacationFormValues & { id: number } = {
      id: 200,
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: 'update action'
    }

    const updateVacationPeriodAction = mock<UpdateVacationPeriodAction>()
    container.registerInstance(UpdateVacationPeriodAction, updateVacationPeriodAction)

    updateVacationPeriodAction.execute.mockRejectedValue(
      createAxiosError(400, { data: { code: 'INVALID_NEXT_YEAR_VACATION_DAYS_REQUEST' } })
    )

    const { onClose } = setup({ initialValues })

    userEvent.click(screen.getByText('update action'))

    await waitFor(() => {
      expect(updateVacationPeriodAction.execute).toHaveBeenCalledWith(initialValues)
      expect(onClose).not.toHaveBeenCalled()
    })

    await waitForNotification({
      title: 'vacation.error_max_vacation_days_requested_next_year_title',
      description: 'vacation.error_max_vacation_days_requested_next_year_message'
    })
  })

  it('should handle new or update vacation period and NOT close on notification error when the period is closed', async () => {
    const initialValues: VacationFormValues & { id: number } = {
      id: 200,
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: 'update action'
    }

    const updateVacationPeriodAction = mock<UpdateVacationPeriodAction>()
    container.registerInstance(UpdateVacationPeriodAction, updateVacationPeriodAction)

    updateVacationPeriodAction.execute.mockRejectedValue(
      createAxiosError(400, { data: { code: 'VACATION_RANGE_CLOSED' } })
    )

    const { onClose } = setup({ initialValues })

    userEvent.click(screen.getByText('update action'))

    await waitFor(() => {
      expect(updateVacationPeriodAction.execute).toHaveBeenCalledWith(initialValues)
      expect(onClose).not.toHaveBeenCalled()
    })

    await waitForNotification({
      title: 'vacation.error_vacation_range_closed_title',
      description: 'vacation.error_vacation_range_closed_message'
    })
  })

  it('should not create or update vacations when the request is before hiring', async () => {
    const initialValues: VacationFormValues & { id: number } = {
      id: 200,
      startDate: '2010-01-01',
      endDate: '2010-01-02',
      description: 'update action'
    }

    const updateVacationPeriodAction = mock<UpdateVacationPeriodAction>()
    container.registerInstance(UpdateVacationPeriodAction, updateVacationPeriodAction)

    updateVacationPeriodAction.execute.mockRejectedValue(
      createAxiosError(400, { data: { code: 'VACATION_BEFORE_HIRING_DATE' } })
    )

    const { onClose } = setup({ initialValues })

    userEvent.click(screen.getByText('update action'))

    await waitFor(() => {
      expect(updateVacationPeriodAction.execute).toHaveBeenCalledWith(initialValues)
      expect(onClose).not.toHaveBeenCalled()
    })

    await waitForNotification({
      title: 'vacation.error_vacation_before_hiring_date_title',
      description: 'vacation.error_vacation_before_hiring_date_description'
    })
  })

  it('should not create vacations when the request is empty', async () => {
    const initialValues: VacationFormValues = {
      id: undefined,
      startDate: '2022-03-12',
      endDate: '2022-03-12',
      description: 'create action'
    }
    const createVacationPeriodAction = mock<CreateVacationPeriodAction>()
    container.registerInstance(CreateVacationPeriodAction, createVacationPeriodAction)

    createVacationPeriodAction.execute.mockRejectedValue(
      createAxiosError(400, { data: { code: 'VACATION_REQUEST_EMPTY' } })
    )

    const { onClose } = setup({ initialValues })

    userEvent.click(screen.getByText('create action'))

    await waitFor(() => {
      expect(createVacationPeriodAction.execute).toHaveBeenCalledWith(initialValues)
      expect(onClose).not.toHaveBeenCalled()
    })

    await waitForNotification({
      title: 'vacation.error_vacation_request_empty_title',
      description: 'vacation.error_vacation_request_empty_description'
    })
  })

  it('should not update vacations when the request is empty', async () => {
    const initialValues: VacationFormValues & { id: number } = {
      id: 200,
      startDate: '2022-03-12',
      endDate: '2022-03-12',
      description: 'update action'
    }
    const updateVacationPeriodAction = mock<UpdateVacationPeriodAction>()
    container.registerInstance(UpdateVacationPeriodAction, updateVacationPeriodAction)

    updateVacationPeriodAction.execute.mockRejectedValue(
      createAxiosError(400, { data: { code: 'VACATION_REQUEST_EMPTY' } })
    )

    const { onClose } = setup({ initialValues })

    userEvent.click(screen.getByText('update action'))

    await waitFor(() => {
      expect(updateVacationPeriodAction.execute).toHaveBeenCalledWith(initialValues)
      expect(onClose).not.toHaveBeenCalled()
    })

    await waitForNotification({
      title: 'vacation.error_vacation_request_empty_title',
      description: 'vacation.error_vacation_request_empty_description'
    })
  })
})

function setup({
  initialValues = {
    id: undefined,
    startDate: '2010-01-01',
    endDate: '2010-01-02',
    description: ''
  },
  isOpen = true,
  onClose = jest.fn()
}: any = {}) {
  render(<VacationFormModal initialValues={initialValues} isOpen={isOpen} onClose={onClose} />)

  return {
    initialValues,
    onClose
  }
}
