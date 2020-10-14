import React, { lazy } from 'react'
import { DataOrModifiedFn } from 'use-async-resource'
import { IHolidays, IPrivateHoliday } from 'api/interfaces/IHolidays'
import { useIsMobile } from 'core/hooks'
import deleteVacationPeriod from 'api/vacation/deleteVacationPeriod'

const LazyVacationTableMobile = lazy(() =>
  import(/* webpackChunkName: "vacation-table-mobile" */ './VacationTable.mobile')
)
const LazyVacationTableDesktop = lazy(() =>
  import(/* webpackChunkName: "vacation-table-desktop" */ './VacationTable.desktop')
)

interface Props {
  holidays: DataOrModifiedFn<IHolidays>
  onEdit: (privateHoliday: IPrivateHoliday) => void
  onRefreshHolidays: () => void
  deleteVacationPeriod?: typeof deleteVacationPeriod
}

export const VacationTable: React.FC<Props> = (props) => {
  const isMobile = useIsMobile()

  return isMobile ? (
    <LazyVacationTableMobile
      holidays={props.holidays}
      onEdit={props.onEdit}
      onRefreshHolidays={props.onRefreshHolidays}
      deleteVacationPeriod={props.deleteVacationPeriod!}
    />
  ) : (
    <LazyVacationTableDesktop
      holidays={props.holidays}
      onEdit={props.onEdit}
      onRefreshHolidays={props.onRefreshHolidays}
      deleteVacationPeriod={props.deleteVacationPeriod!}
    />
  )
}

VacationTable.defaultProps = {
  deleteVacationPeriod: deleteVacationPeriod
}
