import { Absence } from '../../features/binnacle/features/availability/domain/absence'
import { parseISO } from '../../shared/utils/chrono'
import { UserAbsence } from '../../features/binnacle/features/availability/domain/user-absence'

export class AbsenceMother {
  static userAbsences(): UserAbsence[] {
    return [
      this.vacationUser(),
      this.vacationUser({ userId: 3, userName: 'Available user', absences: [] }),
      this.paidLeaveUser(),
      this.paidLeaveUser({
        absences: [
          this.paidLeaveAbsence({
            startDate: parseISO('2023-09-02'),
            endDate: parseISO('2023-09-10')
          })
        ]
      }),
      this.paidLeaveUser({
        absences: [
          this.paidLeaveAbsence({
            startDate: parseISO('2023-09-25'),
            endDate: parseISO('2023-11-10')
          })
        ]
      })
    ]
  }

  static paidLeaveUser(override?: Partial<UserAbsence>): UserAbsence {
    return {
      userId: 1,
      userName: 'Paid leave user',
      absences: [this.paidLeaveAbsence()],
      ...override
    }
  }

  static vacationUser(override?: Partial<UserAbsence>): UserAbsence {
    return {
      userId: 1,
      userName: 'Vacation user',
      absences: [this.vacationAbsence()],
      ...override
    }
  }

  static paidLeaveAbsence(override?: Partial<Absence>): Absence {
    return {
      type: 'PAID_LEAVE',
      startDate: parseISO('2023-09-01'),
      endDate: parseISO('2023-09-01'),
      ...override
    }
  }

  static vacationAbsence(override?: Partial<Absence>): Absence {
    return {
      type: 'VACATION',
      startDate: parseISO('2023-09-03'),
      endDate: parseISO('2023-09-05'),
      ...override
    }
  }
}
