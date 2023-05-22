import { render, screen, userEvent, waitFor } from '../../../../../test-utils/app-test-utils'
import { SignInWithGoogleButton } from './sign-in-with-google-button'

const setup = () => {
  render(<SignInWithGoogleButton />)
}
describe('SignInWithGoogleButton', () => {
  it('should show the sign in with Google button', async function () {
    setup()

    await waitFor(() => {
      expect(screen.getByText('login_page.sign_in_with_google')).toBeInTheDocument()
    })
  })

  it('should change the window location by googleLogin url', async () => {
    const assignSpy = jest.fn()
    // eslint-disable-next-line no-global-assign
    window = Object.create(window)
    const baseUrl = process.env.REACT_APP_API_BASE_URL
    Object.defineProperty(window, 'location', {
      value: {
        assign: assignSpy
      },
      writable: true
    })
    setup()

    await waitFor(() => {
      expect(screen.getByText('login_page.sign_in_with_google')).toBeInTheDocument()
    })

    userEvent.click(screen.getByText('login_page.sign_in_with_google'))

    await waitFor(() => {
      expect(assignSpy).toHaveBeenCalledWith(`${baseUrl}/oauth/login/google`)
    })
  })
})
