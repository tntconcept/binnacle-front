import { lazy } from 'react'

export const LazyYearBalanceTableMobile = lazy(
  () =>
    import(/* webpackChunkName: "year-balance-table-mobile" */ './year-balance-table-router.mobile')
)
