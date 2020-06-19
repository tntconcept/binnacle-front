import React from 'react'
import { render, waitFor } from '@testing-library/react'
import LoginPage from 'pages/login/index'
import { MemoryRouter, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { AuthContext } from 'features/Authentication'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}))

describe('Login page', () => {
  type ProviderMocks = {
    loginMock?: () => Promise<void>
  }

  function renderLoginPage(
    mocks: ProviderMocks | undefined = {
      loginMock: jest.fn()
    }
  ) {
    const wrapper: React.FC = ({ children }) => {
      return (
        <MemoryRouter>
          <Route
            path="/"
            exact>
            <AuthContext.Provider
              // @ts-ignore
              value={{
                // @ts-ignore
                handleLogin: mocks.loginMock
              }}
            >
              {children}
            </AuthContext.Provider>
          </Route>

          <Route path="/binnacle">
            <div>binnacle page</div>
          </Route>
        </MemoryRouter>
      )
    }

    return render(<LoginPage />, { wrapper: wrapper })
  }

  it('should login the user when the credentials are valid', async () => {
    const loginMock = jest.fn().mockResolvedValue(null)

    const { getByTestId, getByText } = renderLoginPage({
      loginMock
    })

    expect(getByTestId('username')).toHaveFocus()

    await userEvent.type(getByTestId('username'), 'test')
    await userEvent.type(getByTestId('password'), 'testtest')
    userEvent.click(getByTestId('login_button'))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('test', 'testtest')
      expect(getByText('binnacle page')).toBeInTheDocument()
    })
  })

  it('should validate fields on submit', async () => {
    const { getByTestId, getAllByText } = renderLoginPage({ loginMock: undefined })

    userEvent.click(getByTestId('login_button'))

    await waitFor(() => {
      expect(getAllByText('form_errors.field_required')).toHaveLength(2)
    })
  })

  it('should autofocus the username on load and after a request error', async () => {
    const loginMock = jest.fn().mockRejectedValue({ response: { status: 401 } })
    const { getByTestId } = renderLoginPage({ loginMock })

    expect(getByTestId('username')).toHaveFocus()

    await userEvent.type(getByTestId('username'), 'test')
    await userEvent.type(getByTestId('password'), 'testtest')
    userEvent.click(getByTestId('login_button'))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('test', 'testtest')
    })

    expect(getByTestId('username')).toHaveFocus()
    expect(getByTestId('username')).toBeEmptyDOMElement()
    expect(getByTestId('password')).toBeEmptyDOMElement()
  })

  it('should be able to see and hide the password', async () => {
    const { getByTestId } = renderLoginPage()

    expect(getByTestId('password')).toHaveAttribute('type', 'password')

    userEvent.click(getByTestId('password_visibility_button'))

    expect(getByTestId('password')).toHaveAttribute('type', 'text')

    userEvent.click(getByTestId('password_visibility_button'))

    await waitFor(() => {
      expect(getByTestId('password')).toHaveAttribute('type', 'password')
    })
  })
})
