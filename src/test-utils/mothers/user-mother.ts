import { UserInfo } from '../../features/shared/user/domain/user-info'
import { User } from '../../features/shared/user/domain/user'

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
      id: 1,
      username: 'John',
      roles: ['ROLE_USER'],
      hiringDate: new Date('2023-01-01')
    }
  }
}
