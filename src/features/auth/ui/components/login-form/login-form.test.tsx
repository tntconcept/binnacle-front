import { render, screen, waitFor } from '../../../../../test-utils/render'
import { LoginForm } from './login-form'

jest.mock('../../../../version/ui/components/app-version', () => {
  return {
    __esModule: true,
    AppVersion: () => <div>AppVersion</div>
  }
})

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
})
