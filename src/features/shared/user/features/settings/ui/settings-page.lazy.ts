import { lazy } from 'react'

export const LazySettingsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "settings" */ 'features/shared/user/features/settings/ui/settings-page-router'
    )
)
