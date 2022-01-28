import { lazy } from 'react'

export const LazySettingsPage = lazy(() =>
  import(/* webpackChunkName: "settings" */ 'modules/settings/page/SettingsPage')
)
