import { lazy } from 'react'

export const LazyLoginPage = lazy(
  () => import(/* webpackChunkName: "login" */ 'features/auth/ui/login-page-router')
)
