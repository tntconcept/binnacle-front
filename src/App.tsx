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

const App: React.FC = () => {
  return (
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
  );
};

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
