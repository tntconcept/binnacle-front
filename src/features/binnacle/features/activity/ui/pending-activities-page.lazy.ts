import { lazy } from 'react'

export const LazyPendingActivitiesPage = lazy(
  () =>
    import(
      /* webpackChunkName: "pending-activities" */ 'features/binnacle/features/activity/ui/pending-activities-page-router'
    )
)
