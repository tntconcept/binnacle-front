import type { TimeBalance } from 'modules/binnacle/data-access/interfaces/time-balance.interface'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import chrono from 'shared/utils/chrono'
import { singleton } from 'tsyringe'

@singleton()
export class TimeBalanceRepository {
  constructor(private httpClient: HttpClient) {}

  async getTimeBalance(startDate: Date, endDate: Date): Promise<Record<string, TimeBalance>> {
    return await this.httpClient.get(endpoints.timeBalance, {
      params: {
        startDate: chrono(startDate).format(chrono.DATE_FORMAT),
        endDate: chrono(endDate).format(chrono.DATE_FORMAT)
      }
    })
  }
}
