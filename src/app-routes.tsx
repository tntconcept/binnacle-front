import type { FC } from 'react'
import { Suspense, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import FullPageLoadingSpinner from 'shared/components/FullPageLoadingSpinner'
import { useIsMobile } from 'shared/hooks'
import { RequireAuth } from 'shared/router/RequireAuth'
import { container } from 'tsyringe'
import { LazySettingsPage } from 'features/user/features/settings/ui/settings-page.lazy'
import { LogoutCmd } from 'features/user/application/logout-cmd'
import { LazyVacationsPage } from 'features/binnacle/features/vacation/ui/vacations-page.lazy'
import { useResolve } from 'shared/di/use-resolve'
import { HttpSessionInterceptor } from 'shared/http/http-session-interceptor'
import { rawPaths } from 'shared/router/paths'
import { Navbar } from 'shared/components/Navbar/Navbar'
import { LazyCalendarMobile } from 'features/binnacle/features/activity/ui/calendar-mobile/calendar-mobile.lazy'
import { LazyLoginPage } from 'features/user/ui/login-page.lazy'
import { LazyCalendarDesktop } from 'features/binnacle/features/activity/ui/calendar-desktop/calendar-desktop.lazy'
import { LazyCalendarPage } from 'features/binnacle/features/activity/ui/calendar-page.lazy'

export const AppRoutes: FC = () => {
  const isMobile = useIsMobile()

  const logoutCmd = useResolve(LogoutCmd)
  const navigate = useNavigate()

  useEffect(() => {
    const redirectToLogin = async () => {
      await logoutCmd.execute()
      navigate('/')
    }

    container.resolve(HttpSessionInterceptor).initInterceptor(redirectToLogin)
  }, [])

  return (
    <>
      <Navbar />
      <Suspense fallback={<FullPageLoadingSpinner />}>
        <Routes>
          <Route path={rawPaths.login} element={<LazyLoginPage />} />
          <Route
            element={
              <RequireAuth>
                <LazyCalendarPage />
              </RequireAuth>
            }
          >
            {/* TODO: redirect '/' to '/calendar' */}
            <Route
              path={rawPaths.home}
              element={isMobile ? <LazyCalendarMobile /> : <LazyCalendarDesktop />}
            />

            <Route
              path={rawPaths.calendar}
              element={isMobile ? <LazyCalendarMobile /> : <LazyCalendarDesktop />}
            />

            <Route
              path={rawPaths.binnacle + '/'}
              element={isMobile ? <LazyCalendarMobile /> : <LazyCalendarDesktop />}
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
