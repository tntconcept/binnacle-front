import { lazy } from 'react'

export const LazyVacationTableMobile = lazy(
  () =>
    import(
      /* webpackChunkName: "vacation-table-mobile" */ 'features/binnacle/features/vacation/ui/components/vacation-table/vacation-table-mobile/vacation-table.mobile'
    )
)
