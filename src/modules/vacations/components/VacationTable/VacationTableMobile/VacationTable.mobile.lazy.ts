import { lazy } from 'react'

export const LazyVacationTableMobile = lazy(
  () =>
    import(
      /* webpackChunkName: "vacation-table-mobile" */ 'modules/vacations/components/VacationTable/VacationTableMobile/VacationTable.mobile'
    )
)
