import React from 'react'
import { DataOrModifiedFn } from 'use-async-resource'
import { Grid, Text } from '@chakra-ui/core'
import { useTranslation } from 'react-i18next'

export interface VacationInformation {
  vacationQtAgreement: number
  vacationSinceEntryDate: number
  acceptedVacationQt: number
  pendingVacationQt: number
}

interface Props {
  vacationReader: DataOrModifiedFn<VacationInformation>
}

export const VacationInformation: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const vacation = props.vacationReader()

  return (
    <Grid templateColumns="1fr 30px">
      <Text>{t('vacation.according_agreement')}</Text>
      <Text justifySelf="center">{vacation.vacationQtAgreement}</Text>
      <Text>{t('vacation.according_entry_date')}</Text>
      <Text justifySelf="center">{vacation.vacationSinceEntryDate}</Text>
      <Text>{t('vacation.days_accepted')}</Text>
      <Text justifySelf="center">{vacation.acceptedVacationQt}</Text>
      <Text>{t('vacation.days_pending')}</Text>
      <Text justifySelf="center">{vacation.pendingVacationQt}</Text>
    </Grid>
  )
}
