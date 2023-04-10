import { mock } from 'jest-mock-extended'
import { UserRepository } from '../domain/user-repository'
import { GetUserLoggedQry } from './get-user-logged-qry'

describe('GetLoggedUser', () => {
  it('should get the logged user using the repository', async () => {
    const { userRepository, getLoggedUserQry } = setup()

    await getLoggedUserQry.internalExecute()

    expect(userRepository.getUser).toBeCalled()
  })
})

function setup() {
  const userRepository = mock<UserRepository>()
  return {
    userRepository,
    getLoggedUserQry: new GetUserLoggedQry(userRepository)
  }
}
