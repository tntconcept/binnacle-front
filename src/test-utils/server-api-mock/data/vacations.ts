import type { Vacation, VacationStatus } from 'shared/types/Vacation'

const acceptedVacation: Vacation = {
  id: 1,
  startDate: new Date('2020-03-10'),
  endDate: new Date('2020-03-10'),
  days: [new Date('2020-03-10')],
  state: 'ACCEPT',
  observations: undefined,
  description: undefined,
  chargeYear: new Date('2020-01-01')
}

const canceledVacation: Vacation = {
  id: 2,
  startDate: new Date('2020-01-10'),
  endDate: new Date('2020-01-15'),
  days: [new Date('2020-01-10'), new Date('2020-01-15')],
  state: 'CANCELLED',
  observations: '8 Dias',
  description: 'Me voy de viaje',
  chargeYear: new Date('2020-01-01')
}

const pendingVacation: Vacation = {
  id: 3,
  startDate: new Date('2020-10-08'),
  endDate: new Date('2020-10-20'),
  days: [new Date('2020-10-08'), new Date('2020-10-20')],
  state: 'PENDING',
  observations: '7 Días',
  description: 'Quiero vacaciones',
  chargeYear: new Date('2020-01-01')
}

const rejectVacation: Vacation = {
  id: 4,
  startDate: new Date('2020-07-07'),
  endDate: new Date('2020-07-08'),
  days: [new Date('2020-07-07'), new Date('2020-07-08')],
  state: 'REJECT',
  observations: '2 Días',
  description: 'Vacaciones de verano',
  chargeYear: new Date('2020-01-01')
}

export const mockVacations = (type: 'ALL' | 'EMPTY' | VacationStatus): Vacation[] => {
  switch (type) {
    case 'ALL':
      return [acceptedVacation, canceledVacation, pendingVacation, rejectVacation]
    case 'EMPTY':
      return []
    case 'ACCEPT':
      return [acceptedVacation]
    case 'CANCELLED':
      return [canceledVacation]
    case 'PENDING':
      return [pendingVacation]
    case 'REJECT':
      return [rejectVacation]
  }
}
