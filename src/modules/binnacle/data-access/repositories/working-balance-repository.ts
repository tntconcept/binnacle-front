import { singleton } from 'tsyringe'
import { HttpClient } from '../../../../shared/data-access/http-client/http-client'
import { WorkingBalance } from '../interfaces/working-balance.interface'
import endpoints from '../../../../shared/api/endpoints'
import chrono from '../../../../shared/utils/chrono'

@singleton()
export class WorkingBalanceRepository {

  constructor(private httpClient: HttpClient) {
  }

  async getWorkingBalance(date: Date): Promise<WorkingBalance> {
    return await this.httpClient.get(endpoints.workingBalance, {
      params: {
        date: chrono(date).format(chrono.DATE_FORMAT)
      }
    })
  }
}