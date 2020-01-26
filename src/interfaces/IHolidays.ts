interface IPublicHoliday {
  compensation: boolean
}

interface IPrivateHoliday {
  description: string
}

export interface IHolidaysResponse {
  publicHolidays: Record<string, IPublicHoliday[]>;
  privateHolidays: Record<string, IPrivateHoliday[]>;
}