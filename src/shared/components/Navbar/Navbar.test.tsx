import { render, screen, userEvent } from 'test-utils/app-test-utils'
import { Navbar } from './navbar'
import { Context as ResponsiveContext } from 'react-responsive'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { paths, rawPaths } from 'shared/router/paths'
import { AppState } from 'shared/data-access/state/app-state'
import { container } from 'tsyringe'
import { LogoutAction } from 'modules/login/data-access/actions/logout-action'
import { mock } from 'jest-mock-extended'
import { waitFor } from '@testing-library/react'

describe('Navbar', () => {
  it('should return null if is not authenticated', () => {
    const { appState, container } = setup({ isMobile: false, route: paths.binnacle })
    appState.isAuthenticated = false

    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('should return null if is mobile and is on binnacle page', () => {
    const { appState, container } = setup({ isMobile: true, route: paths.binnacle })
    appState.isAuthenticated = true

    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('should return mobile navbar and show drawer on menu click', () => {
    const { appState } = setup({ isMobile: true, route: paths.settings })
    appState.isAuthenticated = true

    expect(screen.queryByText('pages.binnacle')).not.toBeInTheDocument()

    userEvent.click(screen.getByLabelText('Menu'))

    expect(screen.queryByText('pages.binnacle')).toBeInTheDocument()
  })

  it('should show settings heading on mobile', () => {
    const { appState } = setup({ isMobile: true, route: paths.settings })
    appState.isAuthenticated = true

    expect(screen.getByText('pages.settings')).toBeInTheDocument()
  })

  it('should show vacations heading on mobile', () => {
    const { appState } = setup({ isMobile: true, route: paths.vacations })
    appState.isAuthenticated = true

    expect(screen.getByText('pages.vacations')).toBeInTheDocument()
  })

  it('should return desktop navbar', () => {
    const { appState } = setup({ isMobile: false, route: paths.binnacle })
    appState.isAuthenticated = true

    expect(screen.getByText('pages.binnacle')).toBeInTheDocument()
  })

  it('should logout', async () => {
    const logoutAction = mock<LogoutAction>()
    container.registerInstance(LogoutAction, logoutAction)

    const { appState } = setup({ isMobile: false, route: paths.binnacle })
    appState.isAuthenticated = true

    userEvent.click(screen.getByText('Logout'))

    await waitFor(() => {
      expect(logoutAction.execute).toHaveBeenCalled()
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  it('should have correct links', () => {
    const { appState } = setup({ isMobile: false, route: paths.binnacle })
    appState.isAuthenticated = true

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

function setup(values: { isMobile: boolean; route: string }) {
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
    appState: container.resolve(AppState),
    container: renderOptions.container
  }
}
