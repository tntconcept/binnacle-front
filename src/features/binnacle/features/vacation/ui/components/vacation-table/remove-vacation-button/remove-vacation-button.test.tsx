import { RemoveVacationButton } from './remove-vacation-button'
import { useGetUseCase } from '../../../../../../../../shared/arch/hooks/use-get-use-case'
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
  within
} from '../../../../../../../../test-utils/render'

jest.mock('../../../../../../../../shared/arch/hooks/use-get-use-case')
describe('RemoveVacationButton', () => {
  test('should cancel remove vacation action', async () => {
    setup(3)

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /actions.remove/i }))
    })

    const inModal = within(screen.getByRole('alertdialog'))
    const modalCancelButton = inModal.getByText('actions.cancel')

    act(() => {
      userEvent.click(modalCancelButton)
    })

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })

  test('should confirm remove vacation action', async () => {
    const { useCaseSpy } = setup(3)

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /actions.remove/i }))
    })

    const inModal = within(screen.getByRole('alertdialog'))
    const modalConfirmButton = inModal.getByText('actions.remove')

    act(() => {
      userEvent.click(modalConfirmButton)
    })

    expect(useCaseSpy).toHaveBeenCalledWith(3, {
      successMessage: 'vacation.remove_vacation_notification'
    })
  })
})

function setup(vacationId: number) {
  const useCaseSpy = jest.fn()
  ;(useGetUseCase as jest.Mock).mockReturnValue({
    isLoading: false,
    executeUseCase: useCaseSpy
  })

  render(<RemoveVacationButton vacationId={vacationId} />)

  return { useCaseSpy }
}
