import { Holiday } from '../../holiday/domain/holiday'
import { Vacation } from '../../vacation/domain/vacation'
import { ActivityWithRenderDays } from './activity-with-render-days'

export interface CalendarDatum {
  date: Date
  worked: number
  activities: ActivityWithRenderDays[]
  vacation?: Vacation
  holiday?: Holiday
}
