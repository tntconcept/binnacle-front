import { TimeSummary } from '../interfaces/time-summary.interface'

export interface TimeSummaryRepository {
  getTimeSummary(date: Date): Promise<TimeSummary>
}
