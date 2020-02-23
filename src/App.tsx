import React from "react"
import "./App.css"
import {NotificationsProvider} from "core/contexts/NotificationsContext"
import {AuthProvider} from "core/contexts/AuthContext"
import Routes from "Routes"
import {SettingsProvider} from "core/contexts/SettingsContext/SettingsContext"
import Combobox from "core/components/Combobox"

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <NotificationsProvider>
        <React.StrictMode>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </React.StrictMode>
      </NotificationsProvider>
    </SettingsProvider>
  );
};

const App4 = () => {
  const options: any = [];

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
