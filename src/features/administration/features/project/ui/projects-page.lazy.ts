import { lazy } from 'react'

export const LazyProjectsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "projects" */ 'features/administration/features/project/ui/projects-page-router'
    )
)
