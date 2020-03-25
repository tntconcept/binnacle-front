import React from "react"
import "./App.css"
import {NotificationsProvider} from "core/contexts/NotificationsContext"
import {AuthProvider} from "core/contexts/AuthContext"
import Routes from "Routes"
import {SettingsProvider} from "core/contexts/SettingsContext/SettingsContext"
import Combobox from "core/components/Combobox"
import ErrorBoundary from "react-error-boundary"
import ErrorBoundaryFallback from "core/components/ErrorBoundaryFallBack"

const App: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <SettingsProvider>
        <NotificationsProvider>
          <React.StrictMode>
            <AuthProvider>
              <Routes />
            </AuthProvider>
          </React.StrictMode>
        </NotificationsProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
};

const App4 = () => {
  const options: any = [
    {
      id: 1,
      name: "A"
    },
    {
      id: 2,
      name: "B"
    },
    {
      id: 3,
      name: "C"
    }
  ];

  const handleChange = (foo: any) => {
    console.log("HandleChange", foo);
  };

  return (
    <Combobox
      options={options}
      value={options[0]}
      onChange={handleChange}
      isLoading={false}
    />
  );
};

export default App;
