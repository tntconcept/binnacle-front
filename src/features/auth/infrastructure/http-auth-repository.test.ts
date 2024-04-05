import { mock } from 'jest-mock-extended'
import { HttpClient } from '../../../shared/http/http-client'
import { HttpAuthRepository } from './http-auth-repository'
import { BASE_URL } from '../../../shared/api/url'

describe('HttpAuthRepository', () => {
  test('should logout the user', async () => {
    const { httpClient, authRepository } = setup()

    httpClient.post.mockResolvedValue('')

    await authRepository.logout()

    expect(httpClient.post).toHaveBeenCalledWith('/logout')
  })

  test('should login', () => {
    global.fetch = jest.fn()
    const { authRepository } = setup()

    authRepository.login({ username: 'username', password: 'password' })

    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/login`, {
      method: 'POST',
      body: '{"username":"username","password":"password"}',
      redirect: 'manual',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    authRepository: new HttpAuthRepository(httpClient)
  }
}
