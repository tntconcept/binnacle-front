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

interface IPrivateHoliday {
  observations?: string
  userComment?: string
  state: PrivateHolidayState
  days: Date[]
}

export interface IHolidays {
  publicHolidays: IPublicHoliday[]
  privateHolidays: IPrivateHoliday[]
}
