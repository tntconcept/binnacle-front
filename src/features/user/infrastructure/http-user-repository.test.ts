import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { buildUser } from 'test-utils/generateTestMocks'
import { AnonymousUserError } from '../domain/anonymous-user-error'
import { HttpUserRepository } from './http-user-repository'

describe('UserRepository', () => {
  test('should get user', async () => {
    const { httpClient, userRepository } = setup()

    httpClient.get.mockResolvedValue(buildUser())

    const result = await userRepository.getUser()

    expect(httpClient.get).toHaveBeenCalledWith('/user/me')
    expect(result).toEqual(buildUser())
  })

  test('should throw AnonymousUserError when httpClient returns 401 error', async () => {
    const { httpClient, userRepository } = setup()
    const error = {
      response: {
        status: 404
      }
    }

    httpClient.get.mockRejectedValue(error)

    expect(userRepository.getUser()).rejects.toThrowError(new AnonymousUserError())
  })

  test('should throw the httpClient error when error is not 401', async () => {
    const { httpClient, userRepository } = setup()
    const error = new Error()

    httpClient.get.mockRejectedValue(error)

    expect(userRepository.getUser()).rejects.toThrowError(error)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    userRepository: new HttpUserRepository(httpClient)
  }
}
