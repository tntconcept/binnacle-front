import React, { useEffect } from 'react'
import './App.css'
import './global.css'
import './css-variables.css'
import { useTranslation } from 'react-i18next'
import { SettingsContextProvider } from 'core/components/SettingsContext'
import { Authentication } from 'core/features/Authentication/Authentication'
import { Notifications } from 'core/features/Notifications/Notifications'
import ErrorBoundary from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundaryFallback from './ErrorBoundaryFallBack'
import { IOSInstallPWAPrompt } from './IOSInstallPWAPrompt'
import Routes from './Routes'
import { ServiceWorkerUpdateBanner } from './ServiceWorkerUpdateBanner'
import dayjs, { DATE_FORMAT } from 'services/dayjs'
import { parseISO } from 'date-fns'

const App: React.FC = () => {
  const { i18n } = useTranslation()

  // 2020-10-10 - 2020-10-20
  // ¡pinta 2020-10-12 - 2020-10-20!

  const date = '2020-10-10'
  const parsedByDateFns = parseISO(date)
  const parsedByDayjs = dayjs(date).toDate()

  console.log('datefns', dayjs(parsedByDateFns).format(DATE_FORMAT))
  console.log(
    'datefns local',
    dayjs(parsedByDateFns)
      .local()
      .format(DATE_FORMAT)
  )
  console.log('dayjs date', dayjs(parsedByDayjs).format(DATE_FORMAT))
  console.log('dayjs raw', dayjs(date).format(DATE_FORMAT))

  useEffect(() => {
    // Update html lang attribute
    window.document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <ServiceWorkerUpdateBanner />
      <IOSInstallPWAPrompt />
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <SettingsContextProvider>
            <Notifications>
              <Authentication>
                <Routes />
              </Authentication>
            </Notifications>
          </SettingsContextProvider>
        </ErrorBoundary>
      </React.StrictMode>
    </BrowserRouter>
  )
}

export default App
