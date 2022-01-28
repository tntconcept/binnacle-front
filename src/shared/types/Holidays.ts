import type { Holiday } from 'shared/types/Holiday'
import type { Vacation } from 'shared/types/Vacation'

export interface Holidays {
  holidays: Holiday[]
  vacations: Vacation[]
}
