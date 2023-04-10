import { lazy } from 'react'

export const LazySettingsPage = lazy(
  () =>
    import(/* webpackChunkName: "settings" */ 'features/user/features/settings/ui/settings-page')
)
