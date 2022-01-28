import { render, screen, userEvent } from 'test-utils/app-test-utils'
import { CellContent } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellContent/CellContent'
import { mockActivityDay } from 'test-utils/generateTestMocks'
import { mock } from 'jest-mock-extended'
import { OpenCreateActivityFormAction } from 'modules/binnacle/data-access/actions/open-create-activity-form-action'
import { container } from 'tsyringe'

describe('CellContent', () => {
  it('should call open create activity form', () => {
    const openCreateActivityFormAction = mock<OpenCreateActivityFormAction>()
    container.registerInstance(OpenCreateActivityFormAction, openCreateActivityFormAction)

    const { activityDay } = setup()

    userEvent.click(screen.getByText('Click me!'))

    expect(openCreateActivityFormAction.execute).toHaveBeenCalledWith(activityDay.date)
  })
})

const setup = () => {
  const selectedMonth = new Date()
  const activityDay = mockActivityDay()

  render(
    <CellContent selectedMonth={selectedMonth} borderBottom={false} activityDay={activityDay}>
      Click me!
    </CellContent>
  )

  return {
    activityDay: activityDay
  }
}
