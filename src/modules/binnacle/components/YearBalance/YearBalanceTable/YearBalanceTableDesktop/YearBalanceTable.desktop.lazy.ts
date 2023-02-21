import { lazy } from 'react'

export const LazyYearBalanceTableDesktop = lazy(
  () =>
    import(
      /* webpackChunkName: "year-balance-table-desktop" */ 'modules/binnacle/components/YearBalance/YearBalanceTable/YearBalanceTableDesktop/YearBalanceTable.desktop'
    )
)
