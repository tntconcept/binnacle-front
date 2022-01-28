import { mock } from 'jest-mock-extended'
import { UserRepository } from 'modules/login/data-access/repositories/user-repository'
import endpoints from 'shared/api/endpoints'
import type { User } from 'shared/api/users/User'
import { HttpClient } from 'shared/data-access/http-client/http-client'

describe('UserRepository', () => {
  test('should get user', async () => {
    const user: User = { foo: '' } as any
    const { httpClient, userService } = setup()

    httpClient.get.mockResolvedValue(user)

    const result = await userService.getUser()

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.user)
    expect(result).toEqual(user)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    userService: new UserRepository(httpClient)
  }
}
