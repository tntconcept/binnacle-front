import React from "react"
import {Route, Switch, useRouteMatch} from "react-router-dom"
import {ActivityFormScreen, BinnacleScreen} from "pages/binnacle/mobile"
import {BinnacleDataProvider} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {CalendarResourcesProvider} from "pages/binnacle/desktop/CalendarResourcesContext"

const BinnacleMobile = () => {
  const { path } = useRouteMatch();
  return (
    <BinnacleDataProvider>
      <CalendarResourcesProvider>
        <Switch>
          <Route
            exact
            path={path}
          >
            <BinnacleScreen />
          </Route>
          <Route path={`${path}/activity`}>
            <ActivityFormScreen />
          </Route>
        </Switch>
      </CalendarResourcesProvider>
    </BinnacleDataProvider>
  )
}

export default BinnacleMobile
