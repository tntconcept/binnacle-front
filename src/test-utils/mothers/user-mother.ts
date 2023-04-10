import { User } from 'shared/api/users/User'

export class UserMother {
  static user(): User {
    return {
      hiringDate: new Date('2023-01-01')
    }
  }
}
