import { LogoutCmd } from './features/auth/application/logout-cmd'
import { LazyLoginPage } from './features/auth/ui/login-page.lazy'
import { LazyCalendarDesktop } from './features/binnacle/features/activity/ui/calendar-desktop/calendar-desktop.lazy'
import { LazyCalendarMobile } from './features/binnacle/features/activity/ui/calendar-mobile/calendar-mobile.lazy'
import { LazyCalendarPage } from './features/binnacle/features/activity/ui/calendar-page.lazy'
import { LazyVacationsPage } from './features/binnacle/features/vacation/ui/vacations-page.lazy'
import { LazySettingsPage } from './features/shared/user/features/settings/ui/settings-page.lazy'
import type { FC } from 'react'
import { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { FullPageLoadingSpinner } from './shared/components/full-page-loading-spinner'
import { Navbar } from './shared/components/navbar/navbar'
import { useAuthContext } from './shared/contexts/auth-context'
import { useResolve } from './shared/di/use-resolve'
import { HttpSessionInterceptor } from './shared/http/http-session-interceptor'
import { paths } from './shared/router/paths'
import { RequireAuth } from './shared/router/require-auth'
import { container } from 'tsyringe'
import { LazyProjectsPage } from './features/administration/features/project/ui/projects-page.lazy'
import { LazyPendingActivitiesPage } from './features/binnacle/features/activity/ui/pending-activities-page.lazy'
import { RequireBlockRole } from './shared/router/require-block-role'
import { RequireActivityApproval } from './shared/router/require-activity-approval'
import { LazyActivitiesPage } from './features/binnacle/features/activity/ui/activities-page.lazy'
import { useIsMobile } from './shared/hooks/use-is-mobile'

export const AppRoutes: FC = () => {
  const isMobile = useIsMobile()
  const { setIsLoggedIn, setCanApproval, setCanBlock } = useAuthContext()

  const logoutCmd = useResolve(LogoutCmd)
  const navigate = useNavigate()

  useEffect(() => {
    const redirectToLogin = async () => {
      await logoutCmd.execute()
      setIsLoggedIn!(false)
      setCanApproval!(false)
      setCanBlock!(false)
      navigate('/')
    }

    container.resolve(HttpSessionInterceptor).initInterceptor(redirectToLogin)
  }, [logoutCmd, navigate, setCanApproval, setCanBlock, setIsLoggedIn])

  return (
    <>
      <Navbar />
      <Suspense fallback={<FullPageLoadingSpinner />}>
        <Routes>
          <Route path={paths.login} element={<LazyLoginPage />} />
          <Route
            element={
              <RequireAuth>
                <LazyCalendarPage />
              </RequireAuth>
            }
          >
            {/* TODO: redirect '/' to '/calendar' */}
            <Route path={paths.home} element={<Navigate to={paths.calendar} />} />

            <Route
              path={paths.calendar}
              element={isMobile ? <LazyCalendarMobile /> : <LazyCalendarDesktop />}
            />

            <Route
              path={paths.binnacle + '/'}
              element={isMobile ? <LazyCalendarMobile /> : <LazyCalendarDesktop />}
            />
            <Route
              path={paths.activities}
              element={
                <RequireAuth>
                  <LazyActivitiesPage />
                </RequireAuth>
              }
            />
          </Route>
          <Route
            path={paths.pendingActivities}
            element={
              <RequireActivityApproval>
                <LazyPendingActivitiesPage />
              </RequireActivityApproval>
            }
          />
          <Route
            path={paths.vacations}
            element={
              <RequireAuth>
                <LazyVacationsPage />
              </RequireAuth>
            }
          />
          <Route
            path={paths.settings}
            element={
              <RequireAuth>
                <LazySettingsPage />
              </RequireAuth>
            }
          />
          <Route
            path={paths.projects}
            element={
              <RequireBlockRole>
                <LazyProjectsPage />
              </RequireBlockRole>
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}
