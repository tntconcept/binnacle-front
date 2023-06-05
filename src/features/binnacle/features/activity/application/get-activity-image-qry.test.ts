import { mock } from 'jest-mock-extended'
import { ActivityRepository } from '../domain/activity-repository'
import { GetActivityEvidenceQry } from './get-activity-image-qry'

describe('GetActivityEvidenceQry', () => {
  it('should get an activity image by id', async () => {
    const { getActivityImageQry, activityRepository } = setup()
    const id = 1

    await getActivityImageQry.internalExecute(id)

    expect(activityRepository.getActivityEvidence).toBeCalledWith(id)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  return {
    getActivityImageQry: new GetActivityEvidenceQry(activityRepository),
    activityRepository
  }
}
