interface IHoliday {
  description: string
  date: Date
  compensation: boolean
}

export enum VacationState {
  'Accept' = 'ACCEPT',
  'Reject' = 'REJECT',
  'Pending' = 'PENDING',
  'Cancelled' = 'CANCELLED'
}

export interface IVacation {
  id?: number
  observations?: string
  description?: string
  state: VacationState
  startDate: Date
  endDate: Date
  days: Date[]
  chargeYear: Date
}

export interface IHolidays {
  holidays: IHoliday[]
  vacations: IVacation[]
}
