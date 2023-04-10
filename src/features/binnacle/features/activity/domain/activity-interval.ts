import { Days } from 'shared/types/days'
import { DateInterval } from 'shared/types/date-interval'
import { Minutes } from 'shared/types/minutes'
import { TimeUnit } from 'shared/types/time-unit'

export type ActivityInterval = DateInterval & {
  duration: Minutes | Days
  timeUnit: TimeUnit
}
