import { lazy } from 'react'

export const LazyCalendarPage = lazy(
  () =>
    import(
      /* webpackChunkName: "tnt", webpackPrefetch: true */ 'features/binnacle/features/activity/ui/calendar-page-router'
    )
)
