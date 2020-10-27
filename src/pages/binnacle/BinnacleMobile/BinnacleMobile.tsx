import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { BinnacleScreen } from 'pages/binnacle/BinnacleMobile/BinnacleScreen/BinnacleScreen'
import { ActivityFormScreen } from 'pages/binnacle/BinnacleMobile/ActivityFormScreen'

const BinnacleMobile = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={path}>
        <BinnacleScreen />
      </Route>
      <Route path={`${path}/activity`}>
        <ActivityFormScreen />
      </Route>
    </Switch>
  )
}

export default BinnacleMobile
