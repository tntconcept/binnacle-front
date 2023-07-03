import { lazy } from 'react'

export const LazyCalendarDesktop = lazy(
  () =>
    import(
      /* webpackChunkName: "calendar-desktop" */ 'features/binnacle/features/activity/ui/calendar-desktop/calendar-desktop-router'
    )
)
