import { lazy } from 'react'

export const LazyPendingActivitiesPage = lazy(
  () => import(/* webpackChunkName: "pending-activities" */ './pending-activities-page-router')
)
