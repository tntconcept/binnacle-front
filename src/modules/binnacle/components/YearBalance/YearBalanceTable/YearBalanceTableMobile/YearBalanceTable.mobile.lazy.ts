import { lazy } from 'react'

export const LazyYearBalanceTableMobile = lazy(
  () =>
    import(
      /* webpackChunkName: "year-balance-table-mobile" */ 'modules/binnacle/components/YearBalance/YearBalanceTable/YearBalanceTableMobile/YearBalanceTable.mobile'
    )
)
