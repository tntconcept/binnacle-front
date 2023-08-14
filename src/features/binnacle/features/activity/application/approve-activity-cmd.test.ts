import { describe, expect, it } from 'vitest'
import { mock } from 'vitest-mock-extended'
import { ActivityRepository } from '../domain/activity-repository'
import { ApproveActivityCmd } from './approve-activity-cmd'

describe('ApproveActivityCmd', () => {
  it('should approve an activity', async () => {
    const { approveActivityCmd, activityRepository } = setup()
    const id = 1

    await approveActivityCmd.internalExecute(id)

    expect(activityRepository.approve).toBeCalledWith(id)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  return {
    approveActivityCmd: new ApproveActivityCmd(activityRepository),
    activityRepository
  }
}
