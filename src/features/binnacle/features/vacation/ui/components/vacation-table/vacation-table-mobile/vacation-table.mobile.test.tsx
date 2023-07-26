import { render, screen, userEvent } from '../../../../../../../../test-utils/render'
import { mockVacations } from '../../../../../../../../test-utils/server-api-mock/data/vacations'
import VacationTableMobile from './vacation-table.mobile'
import { Vacation } from '../../../../domain/vacation'
jest.mock('../remove-vacation-button/remove-vacation-button', () => ({
  RemoveVacationButton: (props: { vacationId: number }) => {
    return <p>Remove vacation id - {props.vacationId} </p>
  }
}))

describe('Mobile Table', () => {
  test('should show a message when vacation array is empty', () => {
    setup(mockVacations('EMPTY'))

    expect(screen.getByText('vacation_table.empty')).toBeInTheDocument()
  })

  test('should show vacation requests', () => {
    setup(mockVacations('ALL'))

    expect(
      screen.getByRole('button', {
        name: '2020-03-10 - 2020-03-10 1 vacation_table.state_accept'
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: '2020-01-10 - 2020-01-15 2 vacation_table.state_canceled'
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: '2020-10-08 - 2020-10-20 2 vacation_table.state_pending'
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: '2020-07-07 - 2020-07-08 2 vacation_table.state_reject'
      })
    ).toBeInTheDocument()
  })

  test('should render remove vacation button', () => {
    setup(mockVacations('PENDING'))

    expect(screen.getByText('Remove vacation id - 3')).toBeInTheDocument()
  })

  test('edit the vacation request when the user click on the edit button', async () => {
    const vacations = mockVacations('PENDING')
    const { onUpdateVacationMock } = setup(vacations)

    // Expand the vacation
    userEvent.click(screen.getByRole('button', { name: /2020-10-08 - 2020-10-20/i }))

    userEvent.click(await screen.findByRole('button', { name: /edit/i }))
    expect(onUpdateVacationMock).toHaveBeenCalledWith(vacations[0])
  })
})

function setup(vacations: Vacation[]) {
  const onUpdateVacationMock = jest.fn()

  render(<VacationTableMobile vacations={vacations} onUpdateVacation={onUpdateVacationMock} />)

  return { onUpdateVacationMock }
}
