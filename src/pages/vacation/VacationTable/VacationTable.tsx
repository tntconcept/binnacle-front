import React, { lazy } from 'react'
import { DataOrModifiedFn } from 'use-async-resource'
import { IHolidays, IPrivateHoliday } from 'api/interfaces/IHolidays'
import { useIsMobile } from 'core/hooks'
import HttpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'

const LazyVacationTableMobile = lazy(() =>
  import(/* webpackChunkName: "vacation-table-mobile" */ './VacationTableMobile')
)
const LazyVacationTableDesktop = lazy(() =>
  import(/* webpackChunkName: "vacation-table-desktop" */ './VacationTableDesktop')
)

interface Props {
  holidays: DataOrModifiedFn<IHolidays>
  onEdit: (privateHoliday: IPrivateHoliday) => void
  onRefreshHolidays: () => void
  deleteVacationPeriod?: (id: number) => Promise<void>
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

async function deleteVacationPeriod(id: number) {
  await HttpClient.delete(`${endpoints.holidays}/${id}`).text()
}

VacationTable.defaultProps = {
  deleteVacationPeriod
}

// <TableRow bg="gray.50">
// <Badge colorScheme="orange">Pending</Badge>
