import React, {Suspense} from "react"
import {Redirect, Route, Switch} from "react-router-dom"
import LoadingLayout from "core/components/LoadingLayout"
import {useAuthentication} from "features/Authentication"
import {ActivityFormScreen} from "pages/binnacle/mobile"
import {useIsMobile} from "core/hooks/useIsMobile"

const LazyLoginPage = React.lazy(() =>
  import(/* webpackChunkName: "login" */ "pages/login")
);

const LazyBinnaclePage = React.lazy(() =>
  import(
    /*
	webpackChunkName: "binnacle",
	webpackPrefetch: true
	*/ "pages/binnacle/BinnaclePage"
  )
);

const LazySettingsPage = React.lazy(() =>
  import(/*
	webpackChunkName: "settings"
	*/ "pages/settings")
);

const Routes: React.FC = () => {
  const isMobile = useIsMobile()

  return (
    <Suspense fallback={<LoadingLayout />}>
      <Switch>
        <Route path="/" exact component={LazyLoginPage} />
        <PrivateRoutes>
          <Route path="/binnacle" component={LazyBinnaclePage} />
          { isMobile && <Route path="/binnacle/activity" component={ActivityFormScreen} /> }
          <Route path="/settings" component={LazySettingsPage} />
        </PrivateRoutes>
      </Switch>
    </Suspense>
  );
};


const PrivateRoutes: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuthentication();

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
};


export default Routes;
