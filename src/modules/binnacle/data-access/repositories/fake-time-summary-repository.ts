import { mockTimeSummaryRelatedRoles } from 'test-utils/generateTestMocks'
import { singleton } from 'tsyringe'
import { TimeSummary } from '../interfaces/time-summary.interface'

@singleton()
export class FakeTimeSummaryRepository {
  async getTimeSummary(date: Date): Promise<TimeSummary> {
    console.log(date)
    return mockTimeSummaryRelatedRoles()
  }
}
