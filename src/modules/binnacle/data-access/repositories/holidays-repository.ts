import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import type { Holidays } from 'shared/types/Holidays'
import type { Serialized } from 'shared/types/Serialized'
import chrono, { parseISO } from 'shared/utils/chrono'
import { singleton } from 'tsyringe'

@singleton()
export class HolidaysRepository {
  constructor(private httpClient: HttpClient) {}

  async getHolidays(startDate: Date, endDate: Date): Promise<Holidays> {
    const data = await this.httpClient.get<Serialized<Holidays>>(endpoints.holidays, {
      params: {
        startDate: chrono(startDate).format(chrono.DATE_FORMAT),
        endDate: chrono(endDate).format(chrono.DATE_FORMAT)
      }
    })

    return {
      holidays: data.holidays.map((holiday) => ({ ...holiday, date: parseISO(holiday.date) })),
      vacations: data.vacations.map((vacation) => {
        return {
          ...vacation,
          startDate: parseISO(vacation.startDate),
          endDate: parseISO(vacation.endDate),
          days: vacation.days.map((day) => parseISO(day)),
          chargeYear: parseISO(vacation.chargeYear)
        }
      })
    }
  }
}
