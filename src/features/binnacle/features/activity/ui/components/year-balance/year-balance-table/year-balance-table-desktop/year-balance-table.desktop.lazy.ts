import { lazy } from 'react'

export const LazyYearBalanceTableDesktop = lazy(
  () =>
    import(
      /* webpackChunkName: "year-balance-table-desktop" */ './year-balance-table-router.desktop'
    )
)
