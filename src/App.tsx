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
    <div style={{ margin: 20 }}>
      <button>A</button>
      <Combobox
        label="Combo"
        name=""
        options={options}
        value={undefined}
        onChange={handleChange}
        isLoading={false}
      />
    </div>
  );
};

export default App;
