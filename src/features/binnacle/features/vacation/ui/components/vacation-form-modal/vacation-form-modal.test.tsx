import { waitFor } from '@testing-library/react'
import { ExtractComponentProps, render, screen, userEvent } from 'test-utils/app-test-utils'
import { VacationForm } from '../vacation-form/vacation-form'
import { VacationFormModal } from './vacation-form-modal'
import { NewVacation } from '../../../domain/new-vacation'
import { UpdateVacation } from '../../../domain/update-vacation'
import { useGetUseCase } from '../../../../../../../shared/arch/hooks/use-get-use-case'

jest.mock('../../../../../../../shared/arch/hooks/use-get-use-case')
jest.mock('../vacation-form/vacation-form', () => ({
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

  it('should close the modal clicking on the close button', async () => {
    const { onClose } = setup()

    userEvent.click(screen.getByLabelText('actions.close'))
    expect(onClose).toHaveBeenCalled()
  })

  it('should handle create vacation period and close on success', async () => {
    const initialValues: NewVacation = {
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-01-02'),
      description: ''
    }

    const { onClose, useCaseSpy } = setup({
      initialValues
    })

    userEvent.click(screen.getByText('create action'))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
      expect(useCaseSpy.execute).toHaveBeenCalled()
    })
  })

  it('should handle update vacation period and close on success', async () => {
    const initialValues: UpdateVacation & { id: number } = {
      id: 200,
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-01-02'),
      description: 'update action'
    }

    const { onClose, useCaseSpy } = setup({
      initialValues
    })

    userEvent.click(screen.getByText('update action'))

    await waitFor(() => {
      expect(useCaseSpy.execute).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('should handle create vacation period and NOT close on error', async () => {
    const initialValues: NewVacation = {
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-01-02'),
      description: ''
    }

    const { onClose, useCaseSpy } = setup({
      initialValues,
      shouldFailRequest: true
    })

    userEvent.click(screen.getByText('create action'))

    await waitFor(() => {
      expect(useCaseSpy.execute).toHaveBeenCalled()
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  it('should handle update vacation period and NOT close on error', async () => {
    const initialValues: UpdateVacation & { id: number } = {
      id: 200,
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-01-02'),
      description: 'update action'
    }

    const { onClose, useCaseSpy } = setup({
      initialValues,
      shouldFailRequest: true
    })

    userEvent.click(screen.getByText('update action'))

    await waitFor(() => {
      expect(useCaseSpy.execute).toHaveBeenCalled()
      expect(onClose).not.toHaveBeenCalled()
    })
  })
})

function setup({
  initialValues = {
    id: undefined,
    startDate: '2022-01-01',
    endDate: '2022-01-02',
    description: ''
  },
  isOpen = true,
  onClose = jest.fn(),
  shouldFailRequest = false
}: any = {}) {
  const executeSpy = jest.fn()
  const useCaseSpy = {
    execute: executeSpy
  }

  if (shouldFailRequest) {
    executeSpy.mockImplementation(() => {
      throw new Error()
    })
  }

  ;(useGetUseCase as jest.Mock).mockReturnValue({
    isLoading: false,
    useCase: useCaseSpy
  })

  render(<VacationFormModal initialValues={initialValues} isOpen={isOpen} onClose={onClose} />)

  return {
    initialValues,
    onClose,
    useCaseSpy
  }
}
