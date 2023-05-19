import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { AnonymousUserError } from '../domain/anonymous-user-error'
import { HttpUserRepository } from './http-user-repository'
import { UserMother } from '../../../test-utils/mothers/user-mother'

describe('UserRepository', () => {
  test('should get user', async () => {
    const { httpClient, userRepository } = setup()

    httpClient.get.mockResolvedValue(UserMother.user())

    const result = await userRepository.getUser()

    expect(httpClient.get).toHaveBeenCalledWith('/api/user/me')
    expect(result).toEqual(UserMother.user())
  })

  test('should logout the user', async () => {
    const { httpClient, userRepository } = setup()

    httpClient.post.mockResolvedValue('')

    await userRepository.logout()

    expect(httpClient.post).toHaveBeenCalledWith('/logout')
  })

  test('should throw AnonymousUserError when httpClient returns 401 error', async () => {
    const { httpClient, userRepository } = setup()
    const error = {
      response: {
        status: 404
      }
    }

    httpClient.get.mockRejectedValue(error)

    await expect(userRepository.getUser()).rejects.toThrowError(new AnonymousUserError())
  })

  test('should throw the httpClient error when error is not 401', async () => {
    const { httpClient, userRepository } = setup()
    const error = new Error()

    httpClient.get.mockRejectedValue(error)

    await expect(userRepository.getUser()).rejects.toThrowError(error)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    userRepository: new HttpUserRepository(httpClient)
  }
}
