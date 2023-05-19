import { mock } from 'jest-mock-extended'
import { ActivityRepository } from '../domain/activity-repository'
import { DeleteActivityCmd } from './delete-activity-cmd'

describe('DeleteActivityCmd', () => {
  it('should delete an activity by id', async () => {
    const { deleteActivityCmd, activityRepository, id } = setup()

    await deleteActivityCmd.internalExecute(id)

    expect(activityRepository.delete).toBeCalledWith(id)
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()

  const id = 1

  return {
    deleteActivityCmd: new DeleteActivityCmd(activityRepository),
    activityRepository,
    id
  }
}
