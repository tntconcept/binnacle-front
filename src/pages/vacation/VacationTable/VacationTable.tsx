import React, { lazy, Suspense } from 'react'
import { DataOrModifiedFn } from 'use-async-resource'
import { IHolidays, IPrivateHoliday } from 'api/interfaces/IHolidays'
import { useIsMobile } from 'core/hooks'
import { Skeleton, Stack } from '@chakra-ui/core'

const LazyVacationTableMobile = lazy(() =>
  import(/* webpackChunkName: "vacation-table-mobile" */ './VacationTableMobile')
)
const LazyVacationTableDesktop = lazy(() =>
  import(/* webpackChunkName: "vacation-table-desktop" */ './VacationTableDesktop')
)

interface Props {
  holidays: DataOrModifiedFn<IHolidays>
  onEdit: (privateHoliday: IPrivateHoliday) => void
  onRemove: (id: number) => void
}

export const VacationTable: React.FC<Props> = (props) => {
  const isMobile = useIsMobile()

  return isMobile ? (
    <Suspense
      fallback={
        <Stack>
          <Skeleton height="35px" />
          <Skeleton height="30px" />
          <Skeleton height="30px" />
        </Stack>
      }
    >
      <LazyVacationTableMobile
        holidays={props.holidays}
        onEdit={props.onEdit}
        onRemove={props.onRemove}
      />
    </Suspense>
  ) : (
    <Suspense fallback={<p>Loading table...</p>}>
      <LazyVacationTableDesktop
        holidays={props.holidays}
        onEdit={props.onEdit}
        onRemove={props.onRemove}
      />
    </Suspense>
  )
}
// <TableRow bg="gray.50">
// <Badge colorScheme="orange">Pending</Badge>
