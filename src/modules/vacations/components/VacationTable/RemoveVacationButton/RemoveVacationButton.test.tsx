import { mock } from 'jest-mock-extended'
import { RemoveVacationButton } from 'modules/vacations/components/VacationTable/RemoveVacationButton/RemoveVacationButton'
import { DeleteVacationPeriodAction } from 'modules/vacations/data-access/actions/delete-vacation-period-action'
import {
  render,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
  within
} from 'test-utils/app-test-utils'
import { container } from 'tsyringe'

describe('RemoveVacationButton', () => {
  test('should cancel remove vacation action', async () => {
    setup(3)

    // Open the delete modal
    userEvent.click(screen.getByRole('button', { name: /actions.remove/i }))

    const inModal = within(screen.getByRole('alertdialog'))
    const modalCancelButton = inModal.getByText('actions.cancel')

    // CANCEL the delete operation
    userEvent.click(modalCancelButton)

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })

  test('should confirm remove vacation action', async () => {
    const deleteVacationPeriodAction = mock<DeleteVacationPeriodAction>()
    container.registerInstance(DeleteVacationPeriodAction, deleteVacationPeriodAction)

    deleteVacationPeriodAction.execute.mockResolvedValue()

    setup(3)

    // Open the delete modal
    userEvent.click(screen.getByRole('button', { name: /actions.remove/i }))

    const inModal = within(screen.getByRole('alertdialog'))
    const modalConfirmButton = inModal.getByText('actions.remove')

    // CONFIRM the delete operation
    userEvent.click(modalConfirmButton)

    await waitForElementToBeRemoved(screen.getByRole('alertdialog'))

    expect(deleteVacationPeriodAction.execute).toHaveBeenCalledWith(3)
  })
})

function setup(vacationId: number) {
  render(<RemoveVacationButton vacationId={vacationId} />)
}
