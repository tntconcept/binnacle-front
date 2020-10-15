import React from 'react'
import { DataOrModifiedFn } from 'use-async-resource'
import { Grid, Text } from '@chakra-ui/core'
import { useTranslation } from 'react-i18next'

export interface IVacationDetails {
  holidaysAgreement: number
  totalYear: number
  totalAccepted: number
  total: number
}

interface Props {
  vacationDetailsReader: DataOrModifiedFn<IVacationDetails>
  selectedYear: Date
}

export const VacationInformation: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const details = props.vacationDetailsReader()

  return (
    <Grid templateColumns="1fr 30px">
      <Text>{t('vacation.according_agreement')}</Text>
      <Text justifySelf="center" data-testid="agreement_holidays">
        {details.holidaysAgreement}
      </Text>
      <Text>{t('vacation.according_entry_date')}</Text>
      <Text justifySelf="center" data-testid="since_hiring_date">
        {details.totalYear}
      </Text>
      <Text>{t('vacation.days_accepted')}</Text>
      <Text justifySelf="center" data-testid="accepted_holidays">
        {details.totalAccepted}
      </Text>
      <Text>{t('vacation.days_pending')}</Text>
      <Text justifySelf="center" data-testid="pending_holidays">
        {details.total}
      </Text>
    </Grid>
  )
}
