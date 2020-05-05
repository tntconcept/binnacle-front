import React from "react"
import {Route, Switch, useRouteMatch} from "react-router-dom"
import {ActivityFormScreen, BinnacleScreen} from "pages/binnacle/mobile"
import {CalendarResourcesProvider} from "core/contexts/CalendarResourcesContext"

const BinnacleMobile = () => {
  const { path } = useRouteMatch();
  return (
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
  )
}

export default BinnacleMobile
