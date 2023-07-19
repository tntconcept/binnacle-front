import { TimeUnit } from '../../../../../shared/types/time-unit'

export interface MaxRegistrableHoursLimitExceeded {
  maxAllowedTime: number
  remainingTime: number
  timeUnit: TimeUnit
  year: number
}
