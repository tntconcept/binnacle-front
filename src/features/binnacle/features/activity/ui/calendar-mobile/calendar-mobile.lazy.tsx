import { lazy } from 'react'

export const LazyCalendarMobile = lazy(
  () =>
    import(
      /* webpackChunkName: "calendar-mobile" */ 'features/binnacle/features/activity/ui/calendar-mobile/calendar-mobile'
    )
)
