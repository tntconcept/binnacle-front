import { lazy } from 'react'

export const LazyCalendarPage = lazy(
  () => import(/* webpackChunkName: "tnt", webpackPrefetch: true */ './calendar-page-router')
)
