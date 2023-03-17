import { TimeUnit } from 'shared/types/time-unit'
import { Interval } from 'shared/types/interval'

export interface ActivityInterval extends Interval {
  duration: number
  timeUnit: TimeUnit
}
