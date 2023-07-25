import { waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { render, screen, userEvent } from '../../../../../../../test-utils/app-test-utils'
import { useGetUseCase } from '../../../../../../../shared/arch/hooks/use-get-use-case'
import { NewVacation } from '../../../domain/new-vacation'
import { UpdateVacation } from '../../../domain/update-vacation'
import { VacationForm } from '../vacation-form/vacation-form'
import { VacationFormModal } from './vacation-form-modal'
import { ComponentProps } from 'react'

jest.mock('../../../../../../../shared/arch/hooks/use-get-use-case')
jest.mock('../vacation-form/vacation-form', () => ({
  VacationForm: (props: ComponentProps<typeof VacationForm>) => {
    return (
      <div>
        <button
          onClick={() => {
            props.createVacationPeriod(props.values)
          }}
        >
          create action
        </button>
        <button
          onClick={() => {
            props.updateVacationPeriod(props.values as any)
          }}
        >
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
    act(() => {
      userEvent.click(screen.getByLabelText('actions.close'))
    })
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

    act(() => {
      userEvent.click(screen.getByText('create action'))
    })

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
      expect(useCaseSpy).toHaveBeenCalled()
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

    act(() => {
      userEvent.click(screen.getByText('update action'))
    })

    await waitFor(() => {
      expect(useCaseSpy).toHaveBeenCalled()
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

    act(() => {
      userEvent.click(screen.getByText('create action'))
    })

    await waitFor(() => {
      expect(useCaseSpy).toHaveBeenCalled()
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

    act(() => {
      userEvent.click(screen.getByText('update action'))
    })

    await waitFor(() => {
      expect(useCaseSpy).toHaveBeenCalled()
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  it('should be in disabled state when is being created or updated', async () => {
    setup({
      isLoading: true
    })

    const submitButton = screen.getByRole('button', { name: /actions.save/ })
    expect(submitButton).toHaveAttribute('disabled')
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
  isLoading = false,
  onClose = jest.fn(),
  shouldFailRequest = false
}: any = {}) {
  const useCaseSpy = jest.fn()

  if (shouldFailRequest) {
    useCaseSpy.mockRejectedValue(null)
  } else {
    useCaseSpy.mockResolvedValue(null)
  }

  ;(useGetUseCase as jest.Mock).mockReturnValue({
    isLoading,
    executeUseCase: useCaseSpy
  })

  render(<VacationFormModal initialValues={initialValues} isOpen={isOpen} onClose={onClose} />)

  return {
    initialValues,
    onClose,
    useCaseSpy
  }
}
