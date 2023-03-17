import { Days } from 'shared/types/days'
import { Interval } from 'shared/types/interval'
import { Minutes } from 'shared/types/minutes'
import { TimeUnit } from 'shared/types/time-unit'

export type ActivityInterval = Interval & {
  duration: Minutes | Days
  timeUnit: TimeUnit
}
