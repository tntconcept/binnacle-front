import { Absence } from '../../features/binnacle/features/availability/domain/absence'
import { parseISO } from '../../shared/utils/chrono'

export class AbsenceMother {
  static absences(): Absence[] {
    return [this.paidLeaveAbsence(), this.vacationAbsence()]
  }

  static paidLeaveAbsence(): Absence {
    return {
      userId: 1,
      userName: 'Paid leave user',
      type: 'PAID_LEAVE',
      startDate: parseISO('2023-01-01'),
      endDate: parseISO('2023-01-02')
    }
  }

  static vacationAbsence(): Absence {
    return {
      userId: 2,
      userName: 'Vacation user',
      type: 'VACATION',
      startDate: parseISO('2023-01-03'),
      endDate: parseISO('2023-01-05')
    }
  }
}
