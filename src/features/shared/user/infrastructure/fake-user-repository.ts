import { singleton } from 'tsyringe'
import { SharedUserRepository } from '../domain/shared-user-repository'
import { User } from '../domain/user'
import { UserInfo } from '../domain/user-info'
import { UserMother } from '../../../../test-utils/mothers/user-mother'

@singleton()
export class FakeUserRepository implements SharedUserRepository {
  async getUser(): Promise<User> {
    return UserMother.user()
  }

  async getUsers(): Promise<UserInfo[]> {
    return UserMother.userList()
  }
}
