import { Vacation } from '../../features/binnacle/features/vacation/domain/vacation'
import { VacationGenerated } from '../../features/binnacle/features/vacation/domain/vacation-generated'
import { VacationSummary } from '../../features/binnacle/features/vacation/domain/vacation-summary'

export class VacationMother {
  static vacations(): Vacation[] {
    return [this.julyVacation()]
  }

  static vacationsGenerated(): VacationGenerated[] {
    return [this.julyVacationGenerated()]
  }

  static vacationSummary(): VacationSummary {
    return {
      holidaysAgreement: 23,
      correspondingVacations: 23,
      acceptedVacations: 5,
      remainingVacations: 18
    }
  }

  static julyVacation(): Vacation {
    return {
      id: 1,
      observations: 'You are the best!',
      description: 'Hi there!',
      state: 'ACCEPT',
      startDate: new Date('2023-07-08'),
      endDate: new Date('2023-07-09'),
      days: [new Date('2023-07-08'), new Date('2023-07-09')],
      chargeYear: new Date('2023-01-01')
    }
  }

  static julyVacationGenerated(): VacationGenerated {
    const { startDate, endDate, chargeYear, days } = this.julyVacation()

    return {
      startDate,
      endDate,
      chargeYear,
      days: days.length
    }
  }
}
