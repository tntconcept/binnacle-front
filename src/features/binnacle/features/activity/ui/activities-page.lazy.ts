import { lazy } from 'react'

export const LazyActivitiesPage = lazy(
  () => import(/* webpackChunkName: "activities" */ './activities-page-router')
)
