import { HttpClient } from 'shared/data-access/http-client/http-client'
import { mock } from 'jest-mock-extended'
import { TimeBalanceRepository } from 'modules/binnacle/data-access/repositories/time-balance-repository'
import { mockTimeBalance } from 'test-utils/generateTestMocks'
import endpoints from 'shared/api/endpoints'

describe('TimeBalanceRepository', () => {
  it('should get time balance', async () => {
    const timeBalanceResponse = {
      '2020-01': mockTimeBalance()
    }
    const { timeBalanceRepository, httpClient } = setup()

    httpClient.get.mockResolvedValue(timeBalanceResponse)

    const startDate = new Date('2021-02-01')
    const endDate = new Date('2021-03-01')

    const result = await timeBalanceRepository.getTimeBalance(startDate, endDate)

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.timeBalance, {
      params: { endDate: '2021-03-01', startDate: '2021-02-01' }
    })
    expect(result).toEqual(timeBalanceResponse)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    timeBalanceRepository: new TimeBalanceRepository(httpClient)
  }
}
