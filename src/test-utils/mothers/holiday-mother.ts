import { Holiday } from '../../features/binnacle/features/holiday/domain/holiday'
import { Serialized } from '../../shared/types/serialized'

export class HolidayMother {
  static holidays(): Holiday[] {
    return [
      {
        date: new Date(),
        description: 'Binnacle holiday'
      }
    ]
  }

  static marchHolidays(): Holiday[] {
    return [
      {
        date: new Date('2023-03-02'),
        description: 'Test holiday'
      },
      {
        date: new Date('2023-03-07'),
        description: 'Test holiday'
      },
      {
        date: new Date('2023-03-17'),
        description: 'Test holiday'
      },
      {
        date: new Date('2023-03-27'),
        description: 'Test holiday'
      }
    ]
  }

  static serializedMarchHolidays(): Serialized<Holiday>[] {
    return [
      {
        date: '2023-03-02',
        description: 'Test holiday'
      },
      {
        date: '2023-03-07',
        description: 'Test holiday'
      },
      {
        date: '2023-03-17',
        description: 'Test holiday'
      },
      {
        date: '2023-03-27',
        description: 'Test holiday'
      }
    ]
  }

  static marchHoliday(): Holiday {
    return {
      date: new Date('2023-03-02'),
      description: 'Test holiday'
    }
  }
}
