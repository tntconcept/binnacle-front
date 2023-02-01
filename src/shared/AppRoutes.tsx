import type { FC } from 'react'
import { lazy, Suspense } from 'react'
import { ActivityFormScreen } from 'modules/binnacle/page/BinnacleMobile/ActivityFormScreen'
import { LazyBinnaclePage } from 'modules/binnacle/page/BinnaclePage.lazy'
import { LazyLoginPage } from 'modules/login/page/LoginPage.lazy'
import { LazySettingsPage } from 'modules/settings/page/SettingsPage.lazy'
import { LazyVacationsPage } from 'modules/vacations/page/VacationsPage.lazy'
import { Route, Routes } from 'react-router-dom'
import FullPageLoadingSpinner from 'shared/components/FullPageLoadingSpinner'
import { Navbar } from 'shared/components/Navbar/Navbar'
import { useIsMobile } from 'shared/hooks'
import { rawPaths } from './router/paths'
import { RequireAuth } from 'shared/router/RequireAuth'

const LazyBinnacleDesktop = lazy(
  () =>
    import(
      /* webpackChunkName: "binnacle-desktop" */ 'modules/binnacle/page/BinnacleDesktop/BinnacleDesktop'
    )
)

const LazyBinnacleMobile = lazy(
  () =>
    import(
      /* webpackChunkName: "binnacle-mobile" */ 'modules/binnacle/page/BinnacleMobile/BinnacleScreen/BinnacleScreen'
    )
)

export const AppRoutes: FC = () => {
  const isMobile = useIsMobile()

  return (
    <>
      <Navbar />
      <Suspense fallback={<FullPageLoadingSpinner />}>
        <Routes>
          <Route path={rawPaths.login} element={<LazyLoginPage />} />
          <Route
            element={
              <RequireAuth>
                <LazyBinnaclePage />
              </RequireAuth>
            }
          >
            <Route
              path={rawPaths.binnacle + '/'}
              element={isMobile ? <LazyBinnacleMobile /> : <LazyBinnacleDesktop />}
            />
            <Route
              path={rawPaths.binnacle + '/' + rawPaths.activity}
              element={<ActivityFormScreen />}
            />
          </Route>
          <Route
            path={rawPaths.vacations}
            element={
              <RequireAuth>
                <LazyVacationsPage />
              </RequireAuth>
            }
          />
          <Route
            path={rawPaths.settings}
            element={
              <RequireAuth>
                <LazySettingsPage />
              </RequireAuth>
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}
