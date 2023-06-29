import { User } from 'shared/api/users/user'
import { UserInfo } from '../../features/shared/user/domain/user-info'

export class UserMother {
  static userList(): UserInfo[] {
    return [
      {
        name: 'John',
        username: 'john',
        id: 1
      },
      {
        name: 'John 2',
        username: 'john2',
        id: 2
      }
    ]
  }

  static user(): User {
    return {
      hiringDate: new Date('2023-01-01')
    }
  }
}
