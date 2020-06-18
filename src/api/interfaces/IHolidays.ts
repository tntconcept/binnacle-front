interface IPublicHoliday {
  description: string
  date: Date
  compensation: boolean
}

interface IPrivateHoliday {
  observations?: string
  userComment?: string
  state: string
  days: Date[]
}

export interface IHolidays {
  publicHolidays: IPublicHoliday[]
  privateHolidays: IPrivateHoliday[]
}
