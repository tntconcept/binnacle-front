import { mock } from 'jest-mock-extended'
import LoginPage from 'modules/login/page/LoginPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { rawPaths } from 'shared/router/paths'
import { render, screen, userEvent, waitFor } from 'test-utils/app-test-utils'
import { container } from 'tsyringe'
import { AutoLoginAction } from 'modules/login/data-access/actions/auto-login-action'
import { GetApiVersionAction } from '../data-access/actions/get-api-version-action'
import endpoints from 'shared/api/endpoints'
import { AppState } from 'shared/data-access/state/app-state'

describe('LoginPage', () => {
  it('should update document title', async function () {
    setup()

    await waitFor(() => {
      expect(screen.getByText('login_page.sign_in_with_google')).toBeInTheDocument()
    })

    expect(document.title).toEqual('Login')
  })

  it('should show the sign in with Google button', async function () {
    setup()

    await waitFor(() => {
      expect(screen.getByText('login_page.sign_in_with_google')).toBeInTheDocument()
    })
  })

  it('should change the window location by googleLogin url', async () => {
    const assignSpy = jest.fn()
    window.location = {
      assign: assignSpy
    } as unknown as Location
    setup()

    await waitFor(() => {
      expect(screen.getByText('login_page.sign_in_with_google')).toBeInTheDocument()
    })

    userEvent.click(screen.getByText('login_page.sign_in_with_google'))

    waitFor(() => {
      expect(assignSpy).toHaveBeenCalledWith(endpoints.googleLogin)
    })
  })

  it('should redirect to binnacle page when user is authenticated', async () => {
    const appState = container.resolve(AppState)
    appState.isAuthenticated = true

    setup()

    await waitFor(() => {
      expect(screen.getByText(/Binnacle Page/i)).toBeInTheDocument()
    })
  })
})

function setup() {
  const autoLoginAction = mock<AutoLoginAction>()
  autoLoginAction.execute.mockResolvedValue()
  container.registerInstance(AutoLoginAction, autoLoginAction)

  const getApiVersionAction = mock<GetApiVersionAction>()
  getApiVersionAction.execute.mockResolvedValue()
  container.registerInstance(GetApiVersionAction, getApiVersionAction)

  render(
    <MemoryRouter initialEntries={[rawPaths.login]}>
      <Routes>
        <Route path={rawPaths.login} element={<LoginPage />} />
        <Route path={rawPaths.binnacle} element={<p> Binnacle Page </p>} />
      </Routes>
    </MemoryRouter>
  )
}
