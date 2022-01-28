import { mock } from 'jest-mock-extended'
import { OpenUpdateActivityFormAction } from 'modules/binnacle/data-access/actions/open-update-activity-form-action'
import { ActivityFormState } from 'modules/binnacle/data-access/state/activity-form-state'
import { mockActivity } from 'test-utils/generateTestMocks'

describe('OpenUpdateActivityFormAction', () => {
  it('should open update activity modal', async () => {
    const { openUpdateActivityFormAction, activityFormState } = setup()

    const activity = mockActivity()
    await openUpdateActivityFormAction.execute(activity)

    expect(activityFormState.activity).toEqual(activity)
    expect(activityFormState.selectedActivityDate).toEqual(activity.startDate)
    expect(activityFormState.lastEndTime).toEqual(undefined)
    expect(activityFormState.isModalOpen).toEqual(true)
  })
})

function setup() {
  const activityFormState = mock<ActivityFormState>()

  return {
    openUpdateActivityFormAction: new OpenUpdateActivityFormAction(activityFormState),
    activityFormState
  }
}
