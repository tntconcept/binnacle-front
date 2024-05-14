import { mock } from 'jest-mock-extended'
import { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'
import { DeleteSubcontractedActivityCmd } from './delete-subcontracted-activity-cmd'

describe('DeleteSubcontractedActivityCmd', () => {
  it('should delete a subcontracted activity by id', async () => {
    const { deleteSubcontractedActivityCmd, subcontractedActivityRepository } = setup()
    const id = 1

    await deleteSubcontractedActivityCmd.internalExecute(id)

    expect(subcontractedActivityRepository.delete).toBeCalledWith(id)
  })
})

function setup() {
  const subcontractedActivityRepository = mock<SubcontractedActivityRepository>()

  return {
    deleteSubcontractedActivityCmd: new DeleteSubcontractedActivityCmd(
      subcontractedActivityRepository
    ),
    subcontractedActivityRepository
  }
}
