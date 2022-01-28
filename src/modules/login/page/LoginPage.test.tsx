import { mock } from 'jest-mock-extended'
import LoginPage from 'modules/login/page/LoginPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { rawPaths } from 'shared/router/paths'
import { createAxiosError, render, screen, userEvent, waitFor } from 'test-utils/app-test-utils'
import { container } from 'tsyringe'
import { AutoLoginAction } from 'modules/login/data-access/actions/auto-login-action'
import { LoginAction } from 'modules/login/data-access/actions/login-action'
import { UserRepository } from 'modules/login/data-access/repositories/user-repository'
import { OAuthRepository } from 'shared/api/oauth/oauth-repository'
import { MemoryTokenStorage } from 'shared/api/oauth/token-storage/memory-token-storage'

describe('LoginPage', () => {
  it('should update document title', async function() {
    setup()

    await waitFor(() => {
      expect(screen.getByLabelText('login_page.username_field')).toBeInTheDocument()
    })

    expect(document.title).toEqual('Login')
  })

  it('should autofocus username on mount', async function() {
    setup()

    await waitFor(() => {
      expect(screen.getByLabelText('login_page.username_field')).toBeInTheDocument()
    })

    expect(screen.getByLabelText('login_page.username_field')).toHaveFocus()
  })

  it('should have empty values by default', async function() {
    setup()
    await waitFor(() => {
      expect(screen.getByLabelText('login_page.username_field')).toBeInTheDocument()
    })

    expect(screen.getByTestId('login-form')).toHaveFormValues({
      username: '',
      password: ''
    })
  })

  it('should require fields on submit', async () => {
    setup()
    await waitFor(() => {
      expect(screen.getByLabelText('login_page.username_field')).toBeInTheDocument()
    })

    userEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getAllByText('form_errors.field_required')).toHaveLength(2)
    })
  })

  it('should redirect to binnacle page on login success', async () => {
    const authRepository = mock<OAuthRepository>()
    const tokenStorage = mock<MemoryTokenStorage>()
    const userRepository = mock<UserRepository>()
    container.registerInstance(OAuthRepository, authRepository)
    authRepository.getOAuthByUserCredentials.mockResolvedValue({
      access_token: 'accessToken',
      refresh_token: 'refreshToken'
    } as any)
    container.registerInstance(MemoryTokenStorage, tokenStorage)
    tokenStorage.setAccessToken.mockImplementation()
    tokenStorage.setRefreshToken.mockImplementation()
    container.registerInstance(UserRepository, userRepository)
    userRepository.getUser.mockResolvedValue({} as any)

    setup()
    await waitFor(() => {
      expect(screen.getByLabelText('login_page.username_field')).toBeInTheDocument()
    })

    userEvent.type(screen.getByLabelText('login_page.username_field'), 'johndoe')
    userEvent.type(screen.getByLabelText('login_page.password_field'), 's3cr3t')
    userEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/Binnacle Page/i)).toBeInTheDocument()
      expect(authRepository.getOAuthByUserCredentials).toHaveBeenCalledWith('johndoe', 's3cr3t')
      expect(tokenStorage.setAccessToken).toHaveBeenCalledWith('accessToken')
      expect(tokenStorage.setRefreshToken).toHaveBeenCalledWith('refreshToken')
      expect(userRepository.getUser).toHaveBeenCalled()
    })
  })

  it('should reset form values and focus username on login http 401 error', async () => {
    const loginAction = mock<LoginAction>()
    container.registerInstance(LoginAction, loginAction)
    loginAction.execute.mockRejectedValue(createAxiosError(401))

    setup()
    await waitFor(() => {
      expect(screen.getByLabelText('login_page.username_field')).toBeInTheDocument()
    })

    userEvent.type(screen.getByLabelText('login_page.username_field'), 'johndoe')
    userEvent.type(screen.getByLabelText('login_page.password_field'), 's3cr3t')
    userEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(loginAction.execute).toHaveBeenCalledWith({ password: 's3cr3t', username: 'johndoe' })
      expect(screen.getByTestId('login-form')).toHaveFormValues({
        username: '',
        password: ''
      })
      expect(screen.getByLabelText('login_page.username_field')).toHaveFocus()
    })
  })

  it('should keep form values and show notification on login http error', async () => {
    const loginAction = mock<LoginAction>()
    container.registerInstance(LoginAction, loginAction)
    loginAction.execute.mockRejectedValue(createAxiosError(500))

    setup()
    await waitFor(() => {
      expect(screen.getByLabelText('login_page.username_field')).toBeInTheDocument()
    })

    userEvent.type(screen.getByLabelText('login_page.username_field'), 'johndoe')
    userEvent.type(screen.getByLabelText('login_page.password_field'), 's3cr3t')
    userEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).toBeDisabled()
    })

    await waitFor(() => {
      expect(screen.getByText('api_errors.server_error')).toBeInTheDocument()
      expect(loginAction.execute).toHaveBeenCalledWith({ password: 's3cr3t', username: 'johndoe' })
    })

    expect(screen.getByRole('button', { name: /login/i })).not.toBeDisabled()
  })
})

function setup() {
  const autoLoginAction = mock<AutoLoginAction>()
  autoLoginAction.execute.mockResolvedValue()
  container.registerInstance(AutoLoginAction, autoLoginAction)

  render(
    <MemoryRouter initialEntries={[rawPaths.login]}>
      <Routes>
        <Route path={rawPaths.login} element={<LoginPage />} />
        <Route path={rawPaths.binnacle} element={<p> Binnacle Page </p>} />
      </Routes>
    </MemoryRouter>
  )
}
