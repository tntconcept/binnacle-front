import { HttpClient } from '../../../../../shared/http/http-client'
import { HttpAbsenceRepository } from './http-absence-repository'
import { mock } from 'jest-mock-extended'

describe('HttpAbsenceRepository', () => {
  it('should get absences', () => {
    const { httpClient, httpAbsenceRepository } = setup()

    httpAbsenceRepository.getAbsences({ startDate: '10-10-2023', endDate: '10-10-2023' })

    expect(httpClient.get).toHaveBeenCalledWith('/api/absence', {
      params: {
        startDate: '10-10-2023',
        endDate: '10-10-2023'
      }
    })
  })
})

const setup = () => {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    httpAbsenceRepository: new HttpAbsenceRepository(httpClient)
  }
}
