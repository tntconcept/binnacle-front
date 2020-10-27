interface TokenSource {
  hasTokens: () => boolean
  getTokens: () => {
    access_token: string | undefined
    refresh_token: string | undefined
  }
  removeTokens: () => void
  storeTokens: (access_token: string, refresh_token: string) => void
}

class MemoryTokenSource implements TokenSource {
  private access_token: string | undefined = undefined
  private refresh_token: string | undefined = undefined

  hasTokens = () => {
    return this.access_token !== undefined && this.refresh_token !== undefined
  }

  getTokens = () => {
    return {
      access_token: this.access_token,
      refresh_token: this.refresh_token
    }
  }

  removeTokens = () => {
    this.access_token = undefined
    this.refresh_token = undefined
  }

  storeTokens = (access_token: string, refresh_token: string) => {
    this.access_token = access_token
    this.refresh_token = refresh_token
  }
}

class StorageTokenSource implements TokenSource {
  private key: string = 'binnacle_tokens'

  hasTokens = () => {
    return sessionStorage.getItem(this.key) !== null
  }

  getTokens = () => {
    const tokens = sessionStorage.getItem(this.key)

    if (tokens) {
      return JSON.parse(tokens)
    }

    return {
      access_token: undefined,
      refresh_token: undefined
    }
  }

  removeTokens = () => {
    sessionStorage.removeItem(this.key)
  }

  storeTokens = (access_token: string, refresh_token: string) => {
    const tokens = {
      access_token,
      refresh_token
    }
    sessionStorage.setItem(this.key, JSON.stringify(tokens))
  }
}

class TokenManager {
  constructor(private tokenSource: TokenSource) {}

  tokensArePersisted = () => this.tokenSource.hasTokens()
  getTokens = () => this.tokenSource.getTokens()
  removeTokens = () => this.tokenSource.removeTokens()
  storeTokens = (access_token: string, refresh_token: string) =>
    this.tokenSource.storeTokens(access_token, refresh_token)
}

function getTokenManager() {
  // @ts-ignore
  const cypressIsRunning = window.Cypress !== undefined

  if (cypressIsRunning) {
    return new TokenManager(new StorageTokenSource())
  } else {
    return new TokenManager(new MemoryTokenSource())
  }
}

export const TokenService = getTokenManager()
