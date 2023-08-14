import { describe, expect, it } from 'vitest'
import { mock } from 'vitest-mock-extended'
import { ActivityRepository } from '../domain/activity-repository'
import { UpdateActivity } from '../domain/update-activity'
import { UpdateActivityCmd } from './update-activity-cmd'

describe('UpdateActivityCmd', () => {
  it('should update the activity correctly', async () => {
    const { updateActivityCmd, activityRepository, updateActivity } = setup()

    await updateActivityCmd.internalExecute(updateActivity)

    expect(activityRepository.update).toBeCalledWith(updateActivity)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  const updateActivity: UpdateActivity = {
    id: 1,
    description: 'Minutes activity',
    billable: true,
    interval: {
      start: new Date('2023-03-01T09:00:00.000Z'),
      end: new Date('2023-03-01T13:00:00.000Z')
    },
    projectRoleId: 1,
    evidence: undefined,
    hasEvidences: false
  }

  return {
    updateActivityCmd: new UpdateActivityCmd(activityRepository),
    activityRepository,
    updateActivity
  }
}
