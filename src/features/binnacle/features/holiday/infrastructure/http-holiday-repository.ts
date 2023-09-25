import { HttpClient } from '../../../../../shared/http/http-client'
import { DateInterval } from '../../../../../shared/types/date-interval'
import { Serialized } from '../../../../../shared/types/serialized'
import { chrono } from '../../../../../shared/utils/chrono'
import { singleton } from 'tsyringe'
import { Holiday } from '../domain/holiday'
import { HolidayRepository } from '../domain/holiday-repository'

@singleton()
export class HttpHolidayRepository implements HolidayRepository {
  protected static holidayPath = '/api/holidays'
  protected static newHolidayPath = '/api/holiday'

  constructor(private httpClient: HttpClient) {}

  async getAll({ start, end }: DateInterval): Promise<Holiday[]> {
    const data = await this.httpClient.get<Serialized<{ holidays: Holiday[] }>>(
      HttpHolidayRepository.holidayPath,
      {
        params: {
          startDate: chrono(start).format(chrono.DATE_FORMAT),
          endDate: chrono(end).format(chrono.DATE_FORMAT)
        }
      }
    )

    const { holidays } = data

    return holidays.map((holiday) => ({ ...holiday, date: new Date(holiday.date) }))
  }

  async getHolidaysByYear(year: number): Promise<Holiday[]> {
    const data = await this.httpClient.get<Serialized<{ holidays: Holiday[] }>>(
      HttpHolidayRepository.newHolidayPath,
      {
        params: {
          year
        }
      }
    )
    const { holidays } = data

    return holidays.map((holiday) => ({ ...holiday, date: new Date(holiday.date) }))
  }
}
