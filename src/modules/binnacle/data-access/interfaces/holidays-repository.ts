import type { Holidays } from 'shared/types/Holidays'

export interface HolidaysRepository {
  getHolidays(startDate: Date, endDate: Date): Promise<Holidays>
}
