import { User, UserRole } from 'shared/api/users/User'

export class UserMother {
  static user(): User {
    return {
      id: 1,
      username: 'test.user',
      name: 'Test user',
      departmentId: 0,
      email: 'test.user@email.com',
      genre: '',
      hiringDate: new Date('2023-01-01'),
      photoUrl: '',
      role: this.userRole(),
      dayDuration: 8,
      agreementYearDuration: 2,
      agreement: {
        id: 1,
        holidaysQuantity: 23,
        yearDuration: 360
      }
    }
  }

  static userRole(): UserRole {
    return {
      id: 1,
      name: 'USER'
    }
  }

  static staffRole(): UserRole {
    return {
      id: 2,
      name: 'STAFF'
    }
  }
}
