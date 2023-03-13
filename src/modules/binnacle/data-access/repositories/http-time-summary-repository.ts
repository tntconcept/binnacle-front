import { singleton } from 'tsyringe'
import { HttpClient } from '../../../../shared/data-access/http-client/http-client'
import endpoints from '../../../../shared/api/endpoints'
import chrono from '../../../../shared/utils/chrono'
import { TimeSummary } from '../interfaces/time-summary.interface'
import { TimeSummaryRepository } from '../interfaces/time-summary-repository'

@singleton()
export class HttpTimeSummaryRepository implements TimeSummaryRepository {
  constructor(private httpClient: HttpClient) {}

  async getTimeSummary(date: Date): Promise<TimeSummary> {
    return await this.httpClient.get(endpoints.timeSummary, {
      params: {
        date: chrono(date).format(chrono.DATE_FORMAT)
      }
    })
  }
}
