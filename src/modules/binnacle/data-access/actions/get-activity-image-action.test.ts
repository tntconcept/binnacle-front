import { ActivitiesRepository } from 'modules/binnacle/data-access/repositories/activities-repository'
import { mock } from 'jest-mock-extended'
import { GetActivityImageAction } from './get-activity-image-action'
import { ActivityFormState } from '../state/activity-form-state'

describe('GetActivityImageAction', () => {
  it('should get the activity image', async () => {
    const { getActivityImageAction, activitiesRepository, activityFormState, expectedValue } =
      setup()
    await getActivityImageAction.execute(1)

    expect(activitiesRepository.getActivityImage).toHaveBeenCalledWith(1)
    expect(activityFormState.initialImageFile).toBe(expectedValue)
  })
})

function setup() {
  const activitiesRepository = mock<ActivitiesRepository>()

  const activityFormState = new ActivityFormState()

  const expectedValue = 'image'
  activitiesRepository.getActivityImage.mockResolvedValue(expectedValue)

  return {
    getActivityImageAction: new GetActivityImageAction(activitiesRepository, activityFormState),
    activitiesRepository,
    activityFormState,
    expectedValue
  }
}
