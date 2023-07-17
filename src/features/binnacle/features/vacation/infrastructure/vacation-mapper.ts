import { parseISO } from '../../../../../shared/utils/chrono'
import { Vacation } from '../domain/vacation'
import { VacationDto } from './vacation-dto'

export class VacationMapper {
  static toDomain(vacationDto: VacationDto): Vacation {
    return {
      ...vacationDto,
      startDate: parseISO(vacationDto.startDate),
      endDate: parseISO(vacationDto.endDate),
      chargeYear: parseISO(vacationDto.chargeYear),
      days: vacationDto.days.map(parseISO)
    }
  }

  static toDomainList(vacationsDto: VacationDto[]): Vacation[] {
    return vacationsDto.map(this.toDomain)
  }
}
