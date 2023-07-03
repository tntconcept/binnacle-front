import { HttpClient } from 'shared/http/http-client'
import { DateInterval } from 'shared/types/date-interval'
import { Id } from 'shared/types/id'
import { chrono } from 'shared/utils/chrono'
import { singleton } from 'tsyringe'
import { NewVacation } from '../domain/new-vacation'
import { UpdateVacation } from '../domain/update-vacation'
import { Vacation } from '../domain/vacation'
import { VacationGenerated } from '../domain/vacation-generated'
import { VacationRepository } from '../domain/vacation-repository'
import { VacationSummary } from '../domain/vacation-summary'
import { VacationDto } from './vacation-dto'
import { VacationMapper } from './vacation-mapper'

@singleton()
export class HttpVacationRepository implements VacationRepository {
  protected static vacationPath = '/api/vacations'
  protected static holidayPath = '/api/holidays'
  protected static calendarPath = '/api/calendar'
  protected static vacationByIdPath = (id: Id) => `${HttpVacationRepository.vacationPath}/${id}`
  protected static vacationDaysPath = `${HttpVacationRepository.calendarPath}/workable-days/count`
  protected static vacationSummaryPath = `${HttpVacationRepository.vacationPath}/details`

  constructor(private httpClient: HttpClient) {}

  async getAll(chargeYear: number): Promise<Vacation[]> {
    const data = await this.httpClient.get<{ vacations: VacationDto[] }>(
      HttpVacationRepository.vacationPath,
      {
        params: {
          chargeYear: chargeYear
        }
      }
    )

    return VacationMapper.toDomainList(data.vacations)
  }

  create(newVacation: NewVacation): Promise<VacationGenerated[]> {
    const data = {
      startDate: chrono(newVacation.startDate).toISOString(),
      endDate: chrono(newVacation.endDate).toISOString(),
      description:
        (newVacation.description ?? '').trim().length > 0 ? newVacation.description : null!
    }

    return this.httpClient.post<VacationGenerated[]>(HttpVacationRepository.vacationPath, data)
  }

  update(vacation: UpdateVacation): Promise<VacationGenerated[]> {
    const data = {
      id: vacation.id,
      startDate: chrono(vacation.startDate).toISOString(),
      endDate: chrono(vacation.endDate).toISOString(),
      description: (vacation.description ?? '').trim().length > 0 ? vacation.description : null!
    }

    return this.httpClient.put<VacationGenerated[]>(HttpVacationRepository.vacationPath, data)
  }

  async delete(vacationId: Id): Promise<void> {
    await this.httpClient.delete(HttpVacationRepository.vacationByIdPath(vacationId))
  }

  getDaysForVacationPeriod({ start, end }: DateInterval): Promise<number> {
    return this.httpClient.get<number>(HttpVacationRepository.vacationDaysPath, {
      params: {
        startDate: start,
        endDate: end
      }
    })
  }

  getVacationSummary(chargeYear: number): Promise<VacationSummary> {
    return this.httpClient.get<VacationSummary>(HttpVacationRepository.vacationSummaryPath, {
      params: {
        chargeYear: chargeYear
      }
    })
  }

  async getAllForDateInterval({ start, end }: DateInterval): Promise<Vacation[]> {
    const data = await this.httpClient.get<{ vacations: VacationDto[] }>(
      HttpVacationRepository.holidayPath,
      {
        params: {
          startDate: chrono(start).format(chrono.DATE_FORMAT),
          endDate: chrono(end).format(chrono.DATE_FORMAT)
        }
      }
    )

    return VacationMapper.toDomainList(data.vacations)
  }
}
