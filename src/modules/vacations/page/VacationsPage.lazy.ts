import { lazy } from 'react'

export const LazyVacationsPage = lazy(() =>
  import(/* webpackChunkName: "vacations" */ 'modules/vacations/page/VacationsPage')
)
