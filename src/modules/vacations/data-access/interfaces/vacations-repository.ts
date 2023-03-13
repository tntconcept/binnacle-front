import { Holidays } from 'shared/types/Holidays'
import { VacationPeriodRequest, VacationPeriodResponse } from '../vacation'
import { VacationDetails } from '../VacationDetails'

export interface VacationsRepository {
  getVacationsByChargeYear(chargeYear: number): Promise<Holidays>

  createVacationPeriod(json: VacationPeriodRequest): Promise<VacationPeriodResponse[]>

  updateVacationPeriod(json: VacationPeriodRequest): Promise<VacationPeriodResponse[]>

  deleteVacationPeriod(vacationId: number): Promise<void>

  getCorrespondingVacationDays(startDate: string, endDate: string): Promise<number>

  getVacationDetailsByChargeYear(chargeYear: number): Promise<VacationDetails>
}
