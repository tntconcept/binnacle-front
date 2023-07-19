import { lazy } from 'react'

export const LazyLoginPage = lazy(() => import(/* webpackChunkName: "login" */ './login-page'))
