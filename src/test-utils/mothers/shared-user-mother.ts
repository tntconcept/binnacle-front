import { User } from 'features/shared/user/domain/user'

export class SharedUserMother {
  static user(): User {
    return {
      hiringDate: new Date('2023-01-01'),
      username: 'any-username',
      roles: [],
      id: 1
    }
  }
}
