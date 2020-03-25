import React from "react"
import {Route, Switch, useRouteMatch} from "react-router-dom"
import {ActivityFormScreen, BinnacleScreen} from "pages/binnacle/mobile"

const BinnacleMobile = () => {
  const { path } = useRouteMatch();
  return (
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
  )
}

export default BinnacleMobile
