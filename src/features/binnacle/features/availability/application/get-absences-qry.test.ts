import { mock } from 'jest-mock-extended'
import { AbsenceRepository } from '../domain/absence-repository'
import { GetAbsencesQry } from './get-absences-qry'
import { AbsenceMother } from '../../../../../test-utils/mothers/absence-mother'

describe('GetAbsencesQry', () => {
  it('should get absences', async function () {
    const { getAbsencesQry, absenceRepository } = setup()
    const absences = AbsenceMother.userAbsences()
    absenceRepository.getAbsences.mockResolvedValue(absences)

    const response = await getAbsencesQry.internalExecute({
      startDate: '10-10-2023',
      endDate: '10-10-2023'
    })

    expect(absenceRepository.getAbsences).toHaveBeenCalledWith({
      startDate: '10-10-2023',
      endDate: '10-10-2023'
    })
    expect(response).toEqual(absences)
  })
})

const setup = () => {
  const absenceRepository = mock<AbsenceRepository>()

  return {
    absenceRepository,
    getAbsencesQry: new GetAbsencesQry(absenceRepository)
  }
}
