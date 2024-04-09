import { render, screen, userEvent, waitFor } from '../../../../../test-utils/render'
import { LoginForm } from './login-form'
import { act } from '@testing-library/react'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { useAuthContext } from '../../../../../shared/contexts/auth-context'

jest.mock('../../../../version/ui/components/app-version', () => {
  return {
    __esModule: true,
    AppVersion: () => <div>AppVersion</div>
  }
})

jest.mock('../../../../../shared/arch/hooks/use-get-use-case')
jest.mock('../../../../../shared/contexts/auth-context')

const useCaseSpy = jest.fn()

describe('LoginForm', () => {
  const setup = () => {
    render(<LoginForm />)
  }
  it('should show welcome title', async () => {
    setup()
    await waitFor(() => {
      expect(screen.getByText('login_page.welcome_title')).toBeInTheDocument()
    })
  })
  it('should show welcome message', async () => {
    setup()
    await waitFor(() => {
      expect(screen.getByText('login_page.welcome_message')).toBeInTheDocument()
    })
  })
  it('should login', async () => {
    ;(useGetUseCase as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      executeUseCase: useCaseSpy
    }))
    ;(useAuthContext as jest.Mock).mockImplementation(() => ({ checkLoggedUser: jest.fn() }))

    setup()

    await act(async () => {
      await userEvent.type(screen.getByLabelText('login_page.username_field'), 'user')
      await userEvent.type(screen.getByLabelText('login_page.password_field'), 'password')
      await userEvent.click(screen.getByRole('button', { name: 'login_page.login' }))
    })

    expect(useCaseSpy).toHaveBeenCalledWith({ password: 'password', username: 'user' })
  })
})
