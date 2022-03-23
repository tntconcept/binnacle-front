import { WorkingTimeRepository } from './working-time-repository'
import { mockWorkingTime } from 'test-utils/generateTestMocks'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import { mock } from 'jest-mock-extended'

describe('WorkingTimeRepository', () => {
  it('should get working time', async () => {
    const workingTimeResponse = {
      '2022-01': mockWorkingTime()
    }
    const { workingTimeRepository: workingTimeRepository, httpClient } = setup()

    httpClient.get.mockResolvedValue(workingTimeResponse)

    const date = new Date('2022-01-01')

    const result = await workingTimeRepository.getWorkingTime(date)

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.workingTime, {
      params: { date: '2022-01-01' }
    })
    expect(result).toEqual(workingTimeResponse)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    workingTimeRepository: new WorkingTimeRepository(httpClient)
  }
}
