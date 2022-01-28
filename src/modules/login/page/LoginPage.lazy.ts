import { lazy } from 'react'

export const LazyLoginPage = lazy(() =>
  import(/* webpackChunkName: "login" */ 'modules/login/page/LoginPage')
)
