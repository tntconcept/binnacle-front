import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { HttpAuthRepository } from './http-auth-repository'

describe('HttpAuthRepository', () => {
  test('should logout the user', async () => {
    const { httpClient, authRepository } = setup()

    httpClient.post.mockResolvedValue('')

    await authRepository.logout()

    expect(httpClient.post).toHaveBeenCalledWith('/logout')
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    authRepository: new HttpAuthRepository(httpClient)
  }
}
