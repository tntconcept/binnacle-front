import { lazy } from 'react'

export const LazyProjectsPage = lazy(
  () => import(/* webpackChunkName: "projects" */ './projects-page-router')
)
