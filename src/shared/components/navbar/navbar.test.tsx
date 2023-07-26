import { render, screen, userEvent, waitFor } from '../../../test-utils/render'
import { Navbar } from './navbar'
import { Context as ResponsiveContext } from 'react-responsive'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { paths, rawPaths } from '../../router/paths'
import { AuthState, useAuthContext } from '../../contexts/auth-context'
import { useResolve } from '../../di/use-resolve'

jest.mock('../../contexts/auth-context')

jest.mock('../../di/use-resolve')

describe('Navbar', () => {
  it('should return null if is not authenticated', () => {
    const { container } = setup({
      isLoggedIn: false,
      isMobile: false,
      route: paths.binnacle
    })

    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('should return null if is mobile and is on binnacle page', () => {
    const { container } = setup({ isLoggedIn: true, isMobile: true, route: paths.binnacle })

    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('should return mobile navbar and show drawer on menu click', () => {
    setup({ isLoggedIn: true, isMobile: true, route: paths.settings })

    expect(screen.queryByText('pages.binnacle')).not.toBeInTheDocument()

    userEvent.click(screen.getByLabelText('Menu'))

    expect(screen.queryByText('pages.binnacle')).toBeInTheDocument()
  })

  it('should show settings heading on mobile', () => {
    setup({ isLoggedIn: true, isMobile: true, route: paths.settings })

    expect(screen.getByText('pages.settings')).toBeInTheDocument()
  })

  it('should show vacations heading on mobile', () => {
    setup({ isLoggedIn: true, isMobile: true, route: paths.vacations })

    expect(screen.getByText('pages.vacations')).toBeInTheDocument()
  })

  it('should return desktop navbar', () => {
    setup({ isLoggedIn: true, isMobile: false, route: paths.binnacle })

    expect(screen.getByText('pages.binnacle')).toBeInTheDocument()
  })

  it('should logout', async () => {
    ;(useResolve as jest.Mock).mockReturnValue({ execute: jest.fn() })
    setup({ isLoggedIn: true, isMobile: false, route: paths.binnacle })

    userEvent.click(screen.getByText('Logout'))

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  it('should have correct links', () => {
    setup({ isLoggedIn: true, isMobile: false, route: paths.binnacle })

    const links = [
      {
        name: 'pages.binnacle',
        accessKey: 'b'
      },
      {
        name: 'pages.vacations',
        accessKey: 'v'
      },
      {
        name: 'pages.settings',
        accessKey: 's'
      },
      {
        name: 'Logout',
        accessKey: 'l'
      }
    ]

    links.forEach((link) => {
      const element = screen.getByText(link.name)
      expect(element).toBeInTheDocument()
      expect(element).toHaveAttribute('accessKey', link.accessKey)
    })
  })
})

function setup(values: { isLoggedIn: boolean; isMobile: boolean; route: string }) {
  ;(useAuthContext as jest.Mock<AuthState>).mockReturnValue({
    isLoggedIn: values.isLoggedIn,
    setIsLoggedIn: jest.fn(),
    setCanApproval: jest.fn(),
    setCanBlock: jest.fn()
  })
  const width = values.isMobile ? 300 : 900

  const renderOptions = render(
    <ResponsiveContext.Provider value={{ width }}>
      <MemoryRouter initialEntries={[values.route]}>
        <Navbar />
        <Routes>
          <Route path={rawPaths.login} element={<p> Login Page </p>} />
          <Route path={rawPaths.binnacle} element={null} />
          <Route path={rawPaths.vacations} element={null} />
          <Route path={rawPaths.settings} element={null} />
        </Routes>
      </MemoryRouter>
    </ResponsiveContext.Provider>
  )

  return {
    container: renderOptions.container
  }
}
