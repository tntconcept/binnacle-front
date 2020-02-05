interface IPublicHoliday {
  description: string;
  date: Date;
  compensation: boolean;
}

interface IPrivateHoliday {
  observations?: string;
  userComment?: string;
  state: string;
  days: Date[];
}

export interface IHolidaysResponse {
  publicHolidays: IPublicHoliday[];
  privateHolidays: IPrivateHoliday[];
}
