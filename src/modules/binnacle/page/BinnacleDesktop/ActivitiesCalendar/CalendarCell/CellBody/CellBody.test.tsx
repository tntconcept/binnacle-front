import { render, screen, userEvent } from 'test-utils/app-test-utils'
import { mockActivity, mockActivityDay } from 'test-utils/generateTestMocks'
import { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import { CellBody } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellBody/CellBody'

jest.mock(
  'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellActivityButton/CellActivityButton',
  () => {
    return {
      CellActivityButton: (props: any) => <button>{props.activity.description}</button>
    }
  }
)

describe('CellBody', () => {
  it('should trap focus', () => {
    setup(true, [
      mockActivity({ description: 'first activity' }),
      mockActivity({ description: 'second activity' })
    ])

    expect(screen.getByText('accessibility.new_activity')).toHaveFocus()

    userEvent.tab()
    expect(screen.getByText('first activity')).toHaveFocus()

    userEvent.tab()
    expect(screen.getByText('second activity')).toHaveFocus()

    userEvent.tab()
    expect(screen.getByText('outside button')).not.toHaveFocus()

    expect(screen.getByText('accessibility.new_activity')).toHaveFocus()
  })

  it('should not trap focus', () => {
    setup(false, [
      mockActivity({ description: 'first activity' }),
      mockActivity({ description: 'second activity' })
    ])

    userEvent.tab()
    expect(screen.getByText('accessibility.new_activity')).not.toHaveFocus()
    expect(screen.getByText('first activity')).toHaveFocus()

    userEvent.tab()
    expect(screen.getByText('second activity')).toHaveFocus()

    userEvent.tab()
    expect(screen.getByText('outside button')).toHaveFocus()
  })

  it('should disable trap on escape key', () => {
    const { mockOnEscKey } = setup(true, [])

    userEvent.keyboard('{Escape}')

    expect(mockOnEscKey).toHaveBeenCalled()
  })
})

const setup = (isSelected: boolean, activities: Activity[]) => {
  const mockOnEscKey = jest.fn()

  render(
    <>
      <CellBody
        isSelected={isSelected}
        onEscKey={mockOnEscKey}
        activityDay={mockActivityDay({ activities })}
      />
      <button>outside button</button>
    </>
  )

  return {
    mockOnEscKey
  }
}
