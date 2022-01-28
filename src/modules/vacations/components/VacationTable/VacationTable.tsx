import { Skeleton, Stack } from '@chakra-ui/react'
import type { Vacation } from 'shared/types/Vacation'
import { LazyVacationTableDesktop } from './VacationTableDesktop/VacationTable.desktop.lazy'
import { LazyVacationTableMobile } from './VacationTableMobile/VacationTable.mobile.lazy'

interface Props {
  isMobile: boolean
  vacations: Vacation[]
  loading: boolean
  onUpdateVacation: (vacation: Vacation) => void
}

export const VacationTable = (props: Props) => {
  if (props.loading) {
    return (
      <Stack data-testid="vacation-table-skeleton">
        <Skeleton height="35px" />
        <Skeleton height="30px" />
        <Skeleton height="30px" />
      </Stack>
    )
  }

  return props.isMobile ? (
    <LazyVacationTableMobile vacations={props.vacations} onUpdateVacation={props.onUpdateVacation} />
  ) : (
    <LazyVacationTableDesktop vacations={props.vacations} onUpdateVacation={props.onUpdateVacation} />
  )
}
