import { Skeleton, Stack } from '@chakra-ui/react'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from 'shared/arch/hooks/use-subscribe-to-use-case'
import { CreateVacationCmd } from '../../../application/create-vacation-cmd'
import { DeleteVacationCmd } from '../../../application/delete-vacation-cmd'
import { GetAllVacationsQry } from '../../../application/get-all-vacations-qry'
import { UpdateVacationCmd } from '../../../application/update-vacation-cmd'
import { Vacation } from '../../../domain/vacation'
import { LazyVacationTableDesktop } from './vacation-table-desktop/vacation-table.desktop.lazy'
import { LazyVacationTableMobile } from './vacation-table-mobile/vacation-table.mobile.lazy'

interface Props {
  isMobile: boolean
  onUpdateVacation: (vacation: Vacation) => void
  chargeYear: number
}

export const VacationTable = (props: Props) => {
  const { isMobile, chargeYear, onUpdateVacation } = props
  const {
    isLoading,
    result: vacations,
    executeUseCase: executeGetVacationsQry
  } = useExecuteUseCaseOnMount(GetAllVacationsQry, chargeYear)

  useSubscribeToUseCase(CreateVacationCmd, () => executeGetVacationsQry(chargeYear), [chargeYear])
  useSubscribeToUseCase(DeleteVacationCmd, () => executeGetVacationsQry(chargeYear), [chargeYear])
  useSubscribeToUseCase(UpdateVacationCmd, () => executeGetVacationsQry(chargeYear), [chargeYear])

  if (isLoading || !vacations) {
    return (
      <Stack data-testid="vacation-table-skeleton">
        <Skeleton height="35px" />
        <Skeleton height="35px" />
        <Skeleton height="35px" />
      </Stack>
    )
  }

  return isMobile ? (
    <LazyVacationTableMobile vacations={vacations} onUpdateVacation={onUpdateVacation} />
  ) : (
    <LazyVacationTableDesktop vacations={vacations} onUpdateVacation={onUpdateVacation} />
  )
}
