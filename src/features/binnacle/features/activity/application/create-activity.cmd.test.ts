import { mock } from 'jest-mock-extended'
import { ActivityRepository } from '../domain/activity-repository'
import { NewActivity } from '../domain/new-activity'
import { CreateActivityCmd } from './create-activity.cmd'

describe('CreateActivityCmd', () => {
  it('should create a new activity', async () => {
    const { createActivityCmd, activityRepository, newActivity } = setup()

    await createActivityCmd.internalExecute(newActivity)

    expect(activityRepository.create).toBeCalledWith(newActivity)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  const newActivity: NewActivity = {
    description: 'any-description',
    billable: true,
    interval: {
      start: new Date('2000-03-01T09:00:00.000Z'),
      end: new Date('2000-03-01T13:00:00.000Z')
    },
    projectRoleId: 1
  }

  return {
    createActivityCmd: new CreateActivityCmd(activityRepository),
    activityRepository,
    newActivity
  }
}
