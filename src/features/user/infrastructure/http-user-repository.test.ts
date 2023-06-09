import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { HttpUserRepository } from './http-user-repository'

describe('UserRepository', () => {
  test('should logout the user', async () => {
    const { httpClient, userRepository } = setup()

    httpClient.post.mockResolvedValue('')

    await userRepository.logout()

    expect(httpClient.post).toHaveBeenCalledWith('/logout')
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    userRepository: new HttpUserRepository(httpClient)
  }
}
