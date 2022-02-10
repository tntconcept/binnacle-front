import type {
  VacationPeriodRequest,
  VacationPeriodResponse
} from 'modules/vacations/data-access/vacation'
import type { VacationDetails } from 'modules/vacations/data-access/VacationDetails'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import type { Holidays } from 'shared/types/Holidays'
import { singleton } from 'tsyringe'
import chrono from 'shared/utils/chrono'

@singleton()
export class VacationsRepository {
  constructor(private httpClient: HttpClient) {}

  async getVacationsByChargeYear(chargeYear: number): Promise<Holidays> {
    return await this.httpClient.get(endpoints.vacations, {
      params: {
        chargeYear: chargeYear
      }
    })
  }

  async createVacationPeriod(json: VacationPeriodRequest): Promise<VacationPeriodResponse[]> {
    const data = {
      id: undefined,
      startDate: chrono(json.startDate).toISOString(),
      endDate: chrono(json.endDate).toISOString(),
      description: (json.description ?? '').trim().length > 0 ? json.description : null!
    }

    return await this.httpClient.post<VacationPeriodResponse[]>(endpoints.vacations, data)
  }

  async updateVacationPeriod(json: VacationPeriodRequest): Promise<VacationPeriodResponse[]> {
    const data = {
      id: json.id,
      startDate: chrono(json.startDate).toISOString(),
      endDate: chrono(json.endDate).toISOString(),
      description: (json.description ?? '').trim().length > 0 ? json.description : null!
    }

    return await this.httpClient.put<VacationPeriodResponse[]>(endpoints.vacations, data)
  }

  async deleteVacationPeriod(vacationId: number): Promise<void> {
    await this.httpClient.delete(`${endpoints.vacations}/${vacationId}`)
  }

  async getCorrespondingVacationDays(startDate: string, endDate: string): Promise<number> {
    return await this.httpClient.get<number>(endpoints.vacationsDays, {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    })
  }

  async getVacationDetailsByChargeYear(chargeYear: number): Promise<VacationDetails> {
    return await this.httpClient.get<VacationDetails>(endpoints.vacationsDetails, {
      params: {
        chargeYear: chargeYear
      }
    })
  }
}
