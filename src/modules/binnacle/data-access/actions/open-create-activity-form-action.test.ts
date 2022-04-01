import { ActivityFormState } from 'modules/binnacle/data-access/state/activity-form-state'
import { OpenCreateActivityFormAction } from 'modules/binnacle/data-access/actions/open-create-activity-form-action'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { mockActivity, mockActivityDay } from 'test-utils/generateTestMocks'

describe('OpenCreateActivityFormAction', () => {
  it('should open without activities', async () => {
    const { openCreateActivityFormAction, activityFormState, binnacleState } = setup()
    binnacleState.activities = []

    await openCreateActivityFormAction.execute(undefined)

    expect(activityFormState.selectedActivityDate).toEqual(activityFormState.selectedActivityDate)
    expect(activityFormState.activity).toEqual(undefined)
    expect(activityFormState.lastEndTime).toEqual(undefined)
    expect(activityFormState.isModalOpen).toEqual(true)
    expect(activityFormState.isEditing).toEqual(false)
  })

  it('should open with activities', () => {
    const { openCreateActivityFormAction, activityFormState, binnacleState } = setup()
    const date = new Date('2100-10-01T00:00:00Z')
    activityFormState.selectedActivityDate = date
    binnacleState.activities = [
      mockActivityDay({
        date: date,
        activities: [mockActivity({ startDate: date })]
      })
    ]

    openCreateActivityFormAction.execute(undefined)

    expect(activityFormState.selectedActivityDate).toEqual(activityFormState.selectedActivityDate)
    expect(activityFormState.activity).toEqual(undefined)
    expect(activityFormState.lastEndTime).toEqual(new Date('2100-10-01T01:40:00Z'))
    expect(activityFormState.isModalOpen).toEqual(true)
  })

  it('should open for a selected date', () => {
    const { openCreateActivityFormAction, activityFormState, binnacleState } = setup()
    const date = new Date('2000-06-01T00:00:00Z')
    binnacleState.activities = [
      mockActivityDay({
        date: date,
        activities: [mockActivity({ startDate: date })]
      })
    ]

    openCreateActivityFormAction.execute(date)

    expect(activityFormState.selectedActivityDate).toEqual(date)
    expect(activityFormState.activity).toEqual(undefined)
    expect(activityFormState.lastEndTime).toEqual(new Date('2000-06-01T01:40:00Z'))
    expect(activityFormState.isModalOpen).toEqual(true)
  })
})

function setup() {
  const activityFormState = new ActivityFormState()
  const binnacleState = new BinnacleState()

  return {
    openCreateActivityFormAction: new OpenCreateActivityFormAction(
      activityFormState,
      binnacleState
    ),
    activityFormState,
    binnacleState
  }
}
