import { lazy } from 'react'

export const LazyCalendarDesktop = lazy(
  () => import(/* webpackChunkName: "calendar-desktop" */ './calendar-desktop-router')
)
