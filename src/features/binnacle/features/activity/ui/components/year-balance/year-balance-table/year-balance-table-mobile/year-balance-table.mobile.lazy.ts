import { lazy } from 'react'

export const LazyYearBalanceTableMobile = lazy(
  () =>
    import(
      /* webpackChunkName: "year-balance-table-mobile" */ 'features/binnacle/features/activity/ui/components/year-balance/year-balance-table/year-balance-table-mobile/year-balance-table-router.mobile'
    )
)
