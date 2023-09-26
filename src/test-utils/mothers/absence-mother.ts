import { Absence } from '../../features/binnacle/features/availability/domain/absence'
import { parseISO } from '../../shared/utils/chrono'

export class AbsenceMother {
  static absences(): Absence[] {
    return [
      this.paidLeaveAbsence(),
      this.paidLeaveAbsence({
        startDate: parseISO('2023-09-02'),
        endDate: parseISO('2023-09-10')
      }),
      this.vacationAbsence()
    ]
  }

  static paidLeaveAbsence(override?: Partial<Absence>): Absence {
    return {
      userId: 1,
      userName: 'Paid leave user',
      type: 'PAID_LEAVE',
      startDate: parseISO('2023-09-01'),
      endDate: parseISO('2023-09-02'),
      ...override
    }
  }

  static vacationAbsence(override?: Partial<Absence>): Absence {
    return {
      userId: 2,
      userName: 'Vacation user',
      type: 'VACATION',
      startDate: parseISO('2023-09-03'),
      endDate: parseISO('2023-09-05'),
      ...override
    }
  }
}
