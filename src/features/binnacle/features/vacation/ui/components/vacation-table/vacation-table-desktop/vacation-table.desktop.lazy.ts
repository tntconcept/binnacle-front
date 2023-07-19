import { lazy } from 'react'

export const LazyVacationTableDesktop = lazy(
  () => import(/* webpackChunkName: "vacation-table-desktop" */ './vacation-table-router.desktop')
)
