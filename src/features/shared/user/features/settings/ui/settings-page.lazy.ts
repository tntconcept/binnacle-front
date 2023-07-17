import { lazy } from 'react'

export const LazySettingsPage = lazy(
  () => import(/* webpackChunkName: "settings" */ './settings-page-router')
)
