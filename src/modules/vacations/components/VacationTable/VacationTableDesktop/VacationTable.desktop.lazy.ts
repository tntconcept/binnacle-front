import { lazy } from 'react'

export const LazyVacationTableDesktop = lazy(
  () =>
    import(
      /* webpackChunkName: "vacation-table-desktop" */ 'modules/vacations/components/VacationTable/VacationTableDesktop/VacationTable.desktop'
    )
)
