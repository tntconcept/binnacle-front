import { MemoryTokenStorage } from 'shared/api/oauth/token-storage/memory-token-storage'
import { container } from 'tsyringe'

describe('MemoryTokenStorage', () => {
  it('should set & get access token', () => {
    const { memoryTokenStorage } = setup()

    memoryTokenStorage.setAccessToken('accessToken')
    expect(memoryTokenStorage.getAccessToken()).toEqual('accessToken')
  })

  it('should set & get refresh token', async () => {
    const { memoryTokenStorage } = setup()

    await memoryTokenStorage.setRefreshToken('refreshToken')
    expect(await memoryTokenStorage.getRefreshToken()).toEqual('refreshToken')
  })

  it('should clear tokens', async () => {
    const { memoryTokenStorage } = setup()

    memoryTokenStorage.setAccessToken('accessToken')
    await memoryTokenStorage.setRefreshToken('refreshToken')

    memoryTokenStorage.clearTokens()

    expect(memoryTokenStorage.getAccessToken()).toEqual(undefined)
    expect(await memoryTokenStorage.getRefreshToken()).toEqual(undefined)
  })
})

function setup() {
  return {
    memoryTokenStorage: container.resolve(MemoryTokenStorage)
  }
}
