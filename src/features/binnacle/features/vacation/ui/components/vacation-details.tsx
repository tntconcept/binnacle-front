import { Grid, SkeletonText, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from 'shared/arch/hooks/use-subscribe-to-use-case'
import { CreateVacationCmd } from '../../application/create-vacation-cmd'
import { DeleteVacationCmd } from '../../application/delete-vacation-cmd'
import { GetVacationSummaryQry } from '../../application/get-vacation-summary-qry'
import { UpdateVacationCmd } from '../../application/update-vacation-cmd'
import { FC } from 'react'

interface Props {
  chargeYear: number
}

export const VacationDetails: FC<Props> = (props) => {
  const { chargeYear } = props
  const { t } = useTranslation()
  const {
    isLoading,
    result: vacationSummary,
    executeUseCase: executeGetVacationSummaryQry
  } = useExecuteUseCaseOnMount(GetVacationSummaryQry, chargeYear)

  useSubscribeToUseCase(CreateVacationCmd, () => executeGetVacationSummaryQry(chargeYear), [
    chargeYear
  ])
  useSubscribeToUseCase(DeleteVacationCmd, () => executeGetVacationSummaryQry(chargeYear), [
    chargeYear
  ])
  useSubscribeToUseCase(UpdateVacationCmd, () => executeGetVacationSummaryQry(chargeYear), [
    chargeYear
  ])

  if (isLoading || vacationSummary === undefined) {
    return <SkeletonText noOfLines={4} spacing="4" />
  }

  return (
    <Grid templateColumns="1fr 30px" maxWidth="600px">
      <Text>{t('vacation.annual')}</Text>
      <Text justifySelf="center" data-testid="since_hiring_date">
        {vacationSummary.correspondingVacations}
      </Text>
      <Text>{t('vacation.days_accepted')}</Text>
      <Text justifySelf="center" data-testid="accepted_holidays">
        {vacationSummary.acceptedVacations}
      </Text>
      <Text>{t('vacation.days_pending')}</Text>
      <Text justifySelf="center" data-testid="pending_holidays">
        {vacationSummary.remainingVacations}
      </Text>
    </Grid>
  )
}
