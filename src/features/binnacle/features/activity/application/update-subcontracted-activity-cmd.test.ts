import { mock } from 'jest-mock-extended'
import { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'
import { UpdateSubcontractedActivity } from '../domain/update-subcontracted-activity'
import { UpdateSubcontractedActivityCmd } from './update-subcontracted-activity-cmd'

describe('UpdateSubcontractedActivityCmd', () => {
  it('should update the subcontracted activity correctly', async () => {
    const {
      updateSubcontractedActivityCmd,
      subcontractedActivityRepository,
      updateSubcontractedActivity
    } = setup()

    await updateSubcontractedActivityCmd.internalExecute(updateSubcontractedActivity)

    expect(subcontractedActivityRepository.update).toBeCalledWith(updateSubcontractedActivity)
  })
})

function setup() {
  const subcontractedActivityRepository = mock<SubcontractedActivityRepository>()

  const updateSubcontractedActivity: UpdateSubcontractedActivity = {
    id: 1,
    description: 'Minutes activity',
    billable: true,
    projectRoleId: 1,
    duration: 555,
    month: '2024-05'
  }

  return {
    updateSubcontractedActivityCmd: new UpdateSubcontractedActivityCmd(
      subcontractedActivityRepository
    ),
    subcontractedActivityRepository,
    updateSubcontractedActivity
  }
}
