import LoginPage from './login-page'
import { render, screen, waitFor } from 'test-utils/app-test-utils'
import { AuthState, useAuthContext } from '../../../shared/contexts/auth-context'
import { useLocation } from 'react-router-dom'

jest.mock('../../../shared/arch/hooks/use-execute-use-case-on-mount')

jest.mock('shared/contexts/auth-context', () => ({
  useAuthContext: jest.fn()
}))

const useNavigateSpy = jest.fn()
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: () => useNavigateSpy
}))

jest.mock('./components/login-form/login-form', () => ({
  __esModule: true,
  LoginForm: () => <p>foo</p>
}))
describe('LoginPage', () => {
  const setup = (isLoggedIn?: boolean) => {
    ;(useAuthContext as jest.Mock<AuthState>).mockReturnValue({ isLoggedIn: isLoggedIn })
    ;(useLocation as jest.Mock).mockReturnValue({
      state: {
        from: ''
      }
    })

    render(<LoginPage />)
  }
  it('should update document title', () => {
    setup()
    expect(document.title).toEqual('Login')
  })

  it('should open FullPageLoadingSpinner when isLoggedIn is undefined', async () => {
    setup()
    await waitFor(() => {
      expect(screen.getByText('logo_n_letter.svg')).toBeInTheDocument()
    })
  })

  it('should open LoginForm when isLoggedIn is false', async () => {
    setup(false)
    await waitFor(() => {
      expect(screen.getByText('foo')).toBeInTheDocument()
    })
  })

  it('should open LoginForm when isLoggedIn is true', async () => {
    setup(true)
    await waitFor(() => {
      expect(screen.getByText('foo')).toBeInTheDocument()
      expect(useNavigateSpy).toHaveBeenCalled()
    })
  })
})
