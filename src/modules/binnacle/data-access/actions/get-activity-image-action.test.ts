import { mock } from 'jest-mock-extended'
import { GetActivityImageAction } from './get-activity-image-action'
import { ActivityFormState } from '../state/activity-form-state'
import { ActivityRepository } from '../interfaces/activity-repository'

describe('GetActivityImageAction', () => {
  it('should get the activity image', async () => {
    const { getActivityImageAction, activityRepository, activityFormState, expectedValue } = setup()
    await getActivityImageAction.execute(1)

    expect(activityRepository.getActivityImage).toHaveBeenCalledWith(1)
    expect(activityFormState.initialImageFile).toBe(expectedValue)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  const activityFormState = new ActivityFormState()

  const expectedValue = 'image'
  activityRepository.getActivityImage.mockResolvedValue(expectedValue)

  return {
    getActivityImageAction: new GetActivityImageAction(activityRepository, activityFormState),
    activityRepository,
    activityFormState,
    expectedValue
  }
}
