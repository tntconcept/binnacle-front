import { TimeSummaryRepository } from './time-summary-repository'
import { mockTimeSummary } from 'test-utils/generateTestMocks'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import { mock } from 'jest-mock-extended'

describe('TimeSummaryRepository', () => {
  it('should get working time', async () => {
    const workingTimeResponse = {
      '2022-01': mockTimeSummary()
    }
    const { TimeSummaryRepository, httpClient } = setup()

    httpClient.get.mockResolvedValue(workingTimeResponse)

    const date = new Date('2022-01-01')

    const result = await TimeSummaryRepository.getTimeSummary(date)

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.timeSummary, {
      params: { date: '2022-01-01' }
    })
    expect(result).toEqual(workingTimeResponse)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    TimeSummaryRepository: new TimeSummaryRepository(httpClient)
  }
}
