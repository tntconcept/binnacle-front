import { DateInterval } from '../../../../../shared/types/date-interval'
import { Id } from '../../../../../shared/types/id'
import { NewVacation } from './new-vacation'
import { UpdateVacation } from './update-vacation'
import { Vacation } from './vacation'
import { VacationGenerated } from './vacation-generated'
import { VacationSummary } from './vacation-summary'

export interface VacationRepository {
  getAll(chargeYear: number): Promise<Vacation[]>

  create(newVacation: NewVacation, chargeYear: number): Promise<VacationGenerated[]>

  update(vacation: UpdateVacation): Promise<VacationGenerated[]>

  delete(vacationId: Id): Promise<void>

  getDaysForVacationPeriod(interval: DateInterval): Promise<number>

  getAllForDateInterval(interval: DateInterval): Promise<Vacation[]>

  getVacationSummary(chargeYear: number): Promise<VacationSummary>
}
