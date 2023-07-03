import { lazy } from 'react'

export const LazyVacationsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "vacations" */ 'features/binnacle/features/vacation/ui/vacations-page-router'
    )
)
