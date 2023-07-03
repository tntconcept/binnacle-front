import { lazy } from 'react'

export const LazyVacationTableDesktop = lazy(
  () =>
    import(
      /* webpackChunkName: "vacation-table-desktop" */ 'features/binnacle/features/vacation/ui/components/vacation-table/vacation-table-desktop/vacation-table-router.desktop'
    )
)
