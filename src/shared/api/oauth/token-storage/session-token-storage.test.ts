import { mock } from 'jest-mock-extended'

import { SessionTokenStorage } from 'shared/api/oauth/token-storage/session-token-storage'

describe('SessionTokenStorage', () => {
  it('should set & get access token', async () => {
    const { sessionTokenStorage } = setup()

    sessionTokenStorage.setAccessToken('accessToken')
    expect(sessionTokenStorage.getAccessToken()).toEqual('accessToken')
  })

  it('should set & get refresh token', async () => {
    const { sessionTokenStorage, storage } = setup()
    storage.getItem.mockReturnValue('Foo')

    expect(await sessionTokenStorage.getRefreshToken()).toBe('Foo')
    expect(storage.getItem).toHaveBeenCalledWith(SessionTokenStorage.REFRESH_TOKEN_KEY)

    await sessionTokenStorage.setRefreshToken('refreshToken')
    expect(storage.setItem).toHaveBeenCalledWith(
      SessionTokenStorage.REFRESH_TOKEN_KEY,
      'refreshToken'
    )
  })

  it('should clear tokens', async () => {
    const { sessionTokenStorage, storage } = setup()

    sessionTokenStorage.setAccessToken('accessToken')
    await sessionTokenStorage.setRefreshToken('refreshToken')

    await sessionTokenStorage.clearTokens()

    expect(sessionTokenStorage.getAccessToken()).toEqual(null)
    expect(storage.removeItem).toHaveBeenCalledWith(SessionTokenStorage.REFRESH_TOKEN_KEY)
  })
})

function setup() {
  const storage = mock<Storage>()

  return {
    storage,
    sessionTokenStorage: new SessionTokenStorage(storage)
  }
}
