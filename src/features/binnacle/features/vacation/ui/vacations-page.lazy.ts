import { lazy } from 'react'

export const LazyVacationsPage = lazy(
  () => import(/* webpackChunkName: "vacations" */ './vacations-page-router')
)
