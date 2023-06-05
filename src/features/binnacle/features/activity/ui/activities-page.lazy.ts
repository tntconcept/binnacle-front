import { lazy } from 'react'

export const LazyActivitiesPage = lazy(
  () =>
    import(
      /* webpackChunkName: "activities" */ 'features/binnacle/features/activity/ui/activities-page'
    )
)
