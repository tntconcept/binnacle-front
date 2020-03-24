class TokenServiceImpl {
  private access_token: string | undefined = undefined
  private refresh_token: string | undefined = undefined

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

export const TokenService = new TokenServiceImpl()
