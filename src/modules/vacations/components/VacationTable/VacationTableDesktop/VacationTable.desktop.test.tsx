import VacationTableDesktop from 'modules/vacations/components/VacationTable/VacationTableDesktop/VacationTable.desktop'
import type { Vacation } from 'shared/types/Vacation'
import { render, screen, userEvent } from 'test-utils/app-test-utils'
import { mockVacations } from 'test-utils/server-api-mock/data/vacations'

jest.mock(
  'modules/vacations/components/VacationTable/RemoveVacationButton/RemoveVacationButton',
  () => ({
    RemoveVacationButton: (props: { vacationId: number }) => {
      return <p>Remove vacation id - {props.vacationId} </p>
    }
  })
)

describe('Desktop Table', () => {
  test('should show a message when there are no vacations', () => {
    setup(mockVacations('EMPTY'))

    expect(screen.getByText('vacation_table.empty')).toBeInTheDocument()
  })

  test('should show vacation requests', () => {
    setup(mockVacations('ALL'))

    const vacationStatus = [
      'vacation_table.state_accept',
      'vacation_table.state_canceled',
      'vacation_table.state_pending',
      'vacation_table.state_reject'
    ]

    vacationStatus.forEach((status) => {
      expect(screen.getByText(status)).toBeInTheDocument()
    })
  })

  test('should render remove vacation button', () => {
    setup(mockVacations('PENDING'))

    expect(screen.getByText('Remove vacation id - 3')).toBeInTheDocument()
  })

  test('should render remove vacation button on future accepted vacation', () => {
    setup(mockVacations('FUTURE_ACCEPTED'))

    expect(screen.getByText('Remove vacation id - 1')).toBeInTheDocument()
  })

  test('edit the vacation request when the user click on the edit button', () => {
    const vacations = mockVacations('PENDING')
    const { onUpdateVacationMock } = setup(vacations)

    userEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onUpdateVacationMock).toHaveBeenCalledWith(vacations[0])
  })
})

function setup(vacations: Vacation[]) {
  const onUpdateVacationMock = jest.fn()

  render(<VacationTableDesktop vacations={vacations} onUpdateVacation={onUpdateVacationMock} />)

  return { onUpdateVacationMock }
}
