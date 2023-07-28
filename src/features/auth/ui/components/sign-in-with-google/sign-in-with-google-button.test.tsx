import { act, render, screen, userEvent, waitFor } from '../../../../../test-utils/render'
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

    await act(async () => {
      await userEvent.click(screen.getByText('login_page.sign_in_with_google'))
    })

    await waitFor(() => {
      expect(assignSpy).toHaveBeenCalledWith(`http://localhost/oauth/login/google`)
    })
  })
})
