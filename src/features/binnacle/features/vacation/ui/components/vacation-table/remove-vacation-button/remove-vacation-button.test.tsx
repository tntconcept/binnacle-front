import { RemoveVacationButton } from './remove-vacation-button'
import { useGetUseCase } from '../../../../../../../../shared/arch/hooks/use-get-use-case'
import { act, render, screen, userEvent, waitFor } from '../../../../../../../../test-utils/render'

jest.mock('../../../../../../../../shared/arch/hooks/use-get-use-case')

describe('RemoveVacationButton', () => {
  test('should cancel remove vacation action', async () => {
    setup()

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /actions.remove/i }))
    })

    const modalCancelButton = screen.getByText('actions.cancel')

    await act(async () => {
      await userEvent.click(modalCancelButton)
    })

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })

  test('should confirm remove vacation action', async () => {
    const { useCaseSpy } = setup()

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /actions.remove/i }))
    })

    const modalConfirmButton = screen.getAllByText('actions.remove')

    await act(async () => {
      await userEvent.click(modalConfirmButton[1])
    })

    expect(useCaseSpy).toHaveBeenCalledWith(3, {
      successMessage: 'vacation.remove_vacation_notification'
    })
  })
})

function setup() {
  const useCaseSpy = jest.fn()
  ;(useGetUseCase as jest.Mock).mockReturnValue({
    isLoading: false,
    executeUseCase: useCaseSpy
  })

  render(<RemoveVacationButton vacationId={3} />)

  return { useCaseSpy }
}
