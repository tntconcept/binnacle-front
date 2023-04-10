import { Holiday } from 'features/binnacle/features/holiday/domain/holiday'

export class HolidayMother {
  static holidays(): Holiday[] {
    return [
      {
        date: new Date(),
        description: 'Binnacle holiday'
      }
    ]
  }
}
