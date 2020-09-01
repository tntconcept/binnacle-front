interface IPublicHoliday {
  description: string
  date: Date
  compensation: boolean
}

export enum PrivateHolidayState {
  'Accept' = 'ACCEPT',
  'Pending' = 'PENDING',
  'Cancelled' = 'CANCELLED'
}

export interface IPrivateHoliday {
  id?: number
  observations?: string
  userComment?: string
  state: PrivateHolidayState
  startDate: Date
  endDate: Date
  days: Date[]
  chargeYear: Date
}

export interface IHolidays {
  publicHolidays: IPublicHoliday[]
  privateHolidays: IPrivateHoliday[]
}
