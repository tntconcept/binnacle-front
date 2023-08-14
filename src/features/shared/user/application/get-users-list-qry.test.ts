import { describe, expect, it } from 'vitest'
import { mock } from 'vitest-mock-extended'
import { UserRepository } from '../domain/user-repository'
import { GetUsersListQry } from './get-users-list-qry'

describe('GetUsersList', () => {
  it('should get the users list using the repository', async () => {
    const { userRepository, getUsersListQry } = setup()

    await getUsersListQry.internalExecute()

    expect(userRepository.getUsers).toBeCalled()
  })
})

function setup() {
  const userRepository = mock<UserRepository>()
  return {
    userRepository,
    getUsersListQry: new GetUsersListQry(userRepository)
  }
}
