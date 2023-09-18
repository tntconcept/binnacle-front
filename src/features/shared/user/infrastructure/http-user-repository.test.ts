import { mock } from 'jest-mock-extended'
import { HttpClient } from '../../../../shared/http/http-client'
import { UserMother } from '../../../../test-utils/mothers/user-mother'
import { AnonymousUserError } from '../domain/anonymous-user-error'
import { HttpUserRepository } from './http-user-repository'

describe('UserRepository', () => {
  test('should get user', async () => {
    const { httpClient, userRepository } = setup()
    const user = UserMother.user()

    httpClient.get.mockResolvedValue(user)

    const result = await userRepository.getUser()

    expect(httpClient.get).toHaveBeenCalledWith('/api/user/me')
    expect(result).toEqual(user)
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

  test('should get users', async () => {
    const { httpClient, userRepository } = setup()

    httpClient.get.mockResolvedValue(UserMother.userList())

    const result = await userRepository.getUsers([1, 2], true)

    expect(httpClient.get).toHaveBeenCalledWith('/api/user', {
      params: {
        active: true,
        ids: [1, 2]
      }
    })
    expect(result).toEqual(UserMother.userList())
  })

  test('should throw AnonymousUserError when httpClient returns 401 error when getting users list', async () => {
    const { httpClient, userRepository } = setup()
    const error = {
      response: {
        status: 404
      }
    }

    httpClient.get.mockRejectedValue(error)

    await expect(userRepository.getUsers()).rejects.toThrowError(new AnonymousUserError())
  })

  test('should throw the httpClient error when error is not 401 when getting users list', async () => {
    const { httpClient, userRepository } = setup()
    const error = new Error()

    httpClient.get.mockRejectedValue(error)

    await expect(userRepository.getUsers()).rejects.toThrowError(error)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    userRepository: new HttpUserRepository(httpClient)
  }
}
