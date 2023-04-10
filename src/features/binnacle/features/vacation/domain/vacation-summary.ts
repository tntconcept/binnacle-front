import { Days } from 'shared/types/days'

export interface VacationSummary {
  holidaysAgreement: Days
  correspondingVacations: Days
  acceptedVacations: Days
  remainingVacations: Days
}
