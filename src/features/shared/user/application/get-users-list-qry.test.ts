import { mock } from 'jest-mock-extended'
import { SharedUserRepository } from '../domain/shared-user-repository'
import { GetUsersListQry } from './get-users-list-qry'

describe('GetUsersList', () => {
  it('should get the users list using the repository', async () => {
    const { userRepository, getUsersListQry } = setup()

    await getUsersListQry.internalExecute()

    expect(userRepository.getUsers).toBeCalled()
  })
})

function setup() {
  const userRepository = mock<SharedUserRepository>()
  return {
    userRepository,
    getUsersListQry: new GetUsersListQry(userRepository)
  }
}
