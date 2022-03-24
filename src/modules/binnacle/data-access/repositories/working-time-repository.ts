import { singleton } from 'tsyringe'
import { HttpClient } from '../../../../shared/data-access/http-client/http-client'
import endpoints from '../../../../shared/api/endpoints'
import chrono from '../../../../shared/utils/chrono'
import { WorkingTime } from '../interfaces/working-time.interface'

@singleton()
export class WorkingTimeRepository {
  constructor(private httpClient: HttpClient) {}

  async getWorkingTime(date: Date): Promise<WorkingTime> {
    return await this.httpClient.get(endpoints.workingTime, {
      params: {
        date: chrono(date).format(chrono.DATE_FORMAT)
      }
    })
  }
}
