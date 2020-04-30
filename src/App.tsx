import React from "react";
import "./App.css";
import { NotificationsProvider } from "core/contexts/NotificationsContext";
import { AuthProvider } from "core/contexts/AuthContext";
import Routes from "Routes";
import { SettingsProvider } from "core/contexts/SettingsContext/SettingsContext";
import ErrorBoundary from "react-error-boundary";
import ErrorBoundaryFallback from "core/components/ErrorBoundaryFallBack";
import PWAPrompt from "react-ios-pwa-prompt";
import { useTranslation } from "react-i18next";
import { SWRConfig } from "swr";

const App: React.FC = () => {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: false
      }}
    >
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
    </SWRConfig>
  );
};

const isHttps = window.location.protocol === "https:";
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const IOSInstallPWAPrompt = () => {
  const { t } = useTranslation();

  const canShowIOSPrompt = isHttps && isSafari;

  return canShowIOSPrompt ? (
    <PWAPrompt
      timesToShow={3}
      permanentlyHideOnDismiss={false}
      copyTitle={t("ios_install_pwa.title")}
      copyBody={t("ios_install_pwa.body")}
      copyShareButtonLabel={t("ios_install_pwa.share_button")}
      copyAddHomeButtonLabel={t("ios_install_pwa.add_home_button")}
      copyClosePrompt={t("close")}
    />
  ) : null;
};

export default App;
