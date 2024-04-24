import { mock } from 'jest-mock-extended'
import { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'
import { NewSubcontractedActivity } from '../domain/new-subcontracted-activity'
import { CreateSubcontractedActivityCmd } from './create-subcontracted-activity-cmd'

describe('CreateSubcontractedActivityCmd', () => {
  it('should create a new subcontracted activity', async () => {
    const {
      createSubcontractedActivityCmd,
      subcontractedActivityRepository,
      newSubcontractedActivity
    } = setup()

    await createSubcontractedActivityCmd.internalExecute(newSubcontractedActivity)

    expect(subcontractedActivityRepository.create).toBeCalledWith(newSubcontractedActivity)
  })
})

function setup() {
  const subcontractedActivityRepository = mock<SubcontractedActivityRepository>()

  const newSubcontractedActivity: NewSubcontractedActivity = {
    description: 'any-description',
    projectRoleId: 1,
    duration: 333,
    month: '2024-05'
  }

  return {
    createSubcontractedActivityCmd: new CreateSubcontractedActivityCmd(
      subcontractedActivityRepository
    ),
    subcontractedActivityRepository,
    newSubcontractedActivity
  }
}
