import { lazy } from 'react'

export const LazyVacationTableMobile = lazy(
  () => import(/* webpackChunkName: "vacation-table-mobile" */ './vacation-table-router.mobile')
)
