import React from "react"
import "./App.css"
import {NotificationsProvider} from "core/contexts/NotificationsContext"
import {AuthProvider} from "core/contexts/AuthContext"
import Routes from "Routes"
import {SettingsProvider} from "core/contexts/SettingsContext/SettingsContext"
import ErrorBoundary from "react-error-boundary"
import ErrorBoundaryFallback from "core/components/ErrorBoundaryFallBack"
import {BinnacleDataProvider} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import BinnacleScreen from "pages/binnacle/mobile/BinnacleScreen/BinnacleScreen"
import PWAPrompt from "react-ios-pwa-prompt"
import {useTranslation} from "react-i18next"

const App: React.FC = () => {
  return (
    <React.Fragment>
      <IOSInstallPWAPrompt />
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <SettingsProvider>
            <NotificationsProvider>
              <AuthProvider>
                <Routes />
              </AuthProvider>
            </NotificationsProvider>
          </SettingsProvider>
        </ErrorBoundary>
      </React.StrictMode>
    </React.Fragment>
  );
};

const IOSInstallPWAPrompt = () => {
  const { t } = useTranslation()

  return process.env.NODE_ENV === 'production' ? (
    <PWAPrompt
      timesToShow={3}
      permanentlyHideOnDismiss={false}
      copyTitle={t("ios_install_pwa.title")}
      copyBody={t("ios_install_pwa.body")}
      copyShareButtonLabel={t("ios_install_pwa.share_button")}
      copyAddHomeButtonLabel={t("ios_install_pwa.add_home_button")}
      copyClosePrompt={t("close")}
    />
  ) : null
}

const MonthView = () => {
  return (
    <SettingsProvider>
      <BinnacleDataProvider>
        <BinnacleScreen />
      </BinnacleDataProvider>
    </SettingsProvider>
  );
};

export default App;
