import React from "react"
import { DataOrModifiedFn } from "use-async-resource"
import {Grid, Text } from '@chakra-ui/core'

export interface VacationInformation {
  vacationQtAgreement: number,
  vacationSinceEntryDate: number
  acceptedVacationQt: number
  pendingVacationQt: number
}


interface Props {
  vacationReader: DataOrModifiedFn<VacationInformation>
}

export const VacationInformation: React.FC<Props> = (props) => {
  const vacation = props.vacationReader()

  return (
    <Grid templateColumns="1fr 30px">
      <Text>Annual holidays (according the agreement)</Text>
      <Text justifySelf="center">{vacation.vacationQtAgreement}</Text>
      <Text>Holidays this year (according entry date)</Text>
      <Text justifySelf="center">{vacation.vacationSinceEntryDate}</Text>
      <Text>Accepted holidays</Text>
      <Text justifySelf="center">{vacation.acceptedVacationQt}</Text>
      <Text>Pending holidays</Text>
      <Text justifySelf="center">{vacation.pendingVacationQt}</Text>
    </Grid>
  )
}
