import { lazy } from 'react'

export const LazyCalendarMobile = lazy(
  () => import(/* webpackChunkName: "calendar-mobile" */ './calendar-mobile-router')
)
