import { lazy } from 'react'

export const LazyYearBalanceTableDesktop = lazy(
  () =>
    import(
      /* webpackChunkName: "year-balance-table-desktop" */ 'features/binnacle/features/activity/ui/components/year-balance/year-balance-table/year-balance-table-desktop/year-balance-table.desktop'
    )
)
