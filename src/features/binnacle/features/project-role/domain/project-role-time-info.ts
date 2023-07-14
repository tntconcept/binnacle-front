import { TimeUnit } from '../../../../../shared/types/time-unit'

export interface TimeInfo {
  maxTimeAllowed: {
    byYear: number
    byActivity: number
  }
  userRemainingTime: number
  timeUnit: TimeUnit
}
