import { lazy } from 'react'

export const LazyLoginPage = lazy(
  () => import(/* webpackChunkName: "login" */ 'features/user/ui/login-page')
)
