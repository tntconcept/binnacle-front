import { WorkingBalanceRepository } from './working-balance-repository'
import { mockWorkingBalance } from 'test-utils/generateTestMocks'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import { mock } from 'jest-mock-extended'

describe('WorkingBalanceRepository', () => {
  it('should get working balance', async () => {
    const workingBalanceResponse = {
      '2022-01': mockWorkingBalance()
    }
    const { workingBalanceRepository, httpClient } = setup()

    httpClient.get.mockResolvedValue(workingBalanceResponse)

    const date = new Date('2022-01-01')

    const result = await workingBalanceRepository.getWorkingBalance(date)

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.workingBalance, {
      params: { date: '2022-01-01' }
    })
    expect(result).toEqual(workingBalanceResponse)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    workingBalanceRepository: new WorkingBalanceRepository(httpClient)
  }
}