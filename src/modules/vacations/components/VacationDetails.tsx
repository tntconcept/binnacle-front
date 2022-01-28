import { Grid, SkeletonText, Text } from '@chakra-ui/react'
import type { VacationDetails as IVacationDetails } from 'modules/vacations/data-access/VacationDetails'
import { useTranslation } from 'react-i18next'

interface Props {
  vacationDetails?: IVacationDetails
  loading: boolean
}

export const VacationDetails = (props: Props) => {
  const { t } = useTranslation()

  if (props.loading || props.vacationDetails === undefined) {
    return <SkeletonText noOfLines={4}
                         spacing="4" />
  }

  return (
    <Grid templateColumns="1fr 30px"
          maxWidth="600px">
      <Text>{t('vacation.according_agreement')}</Text>
      <Text justifySelf="center"
            data-testid="agreement_holidays">
        {props.vacationDetails.holidaysAgreement}
      </Text>
      <Text>{t('vacation.according_entry_date')}</Text>
      <Text justifySelf="center"
            data-testid="since_hiring_date">
        {props.vacationDetails.correspondingVacations}
      </Text>
      <Text>{t('vacation.days_accepted')}</Text>
      <Text justifySelf="center"
            data-testid="accepted_holidays">
        {props.vacationDetails.acceptedVacations}
      </Text>
      <Text>{t('vacation.days_pending')}</Text>
      <Text justifySelf="center"
            data-testid="pending_holidays">
        {props.vacationDetails.remainingVacations}
      </Text>
    </Grid>
  )
}
