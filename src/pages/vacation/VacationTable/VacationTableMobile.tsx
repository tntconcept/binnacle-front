import { DataOrModifiedFn } from 'use-async-resource/src/index'
import {
  IHolidays,
  IPrivateHoliday,
  PrivateHolidayState
} from 'api/interfaces/IHolidays'
import React, {useState} from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Stack,
  Text
} from '@chakra-ui/core'
import { VacationBadge } from './VacationStatusBadge'
import { RemoveVacationButton } from './RemoveVacationButton'
import { formatVacationPeriod } from './formatVacationPeriod'

interface Props {
  holidays: DataOrModifiedFn<IHolidays>
  onEdit: (privateHoliday: IPrivateHoliday) => void
  onRefreshHolidays: () => void
  deleteVacationPeriod: (id: number) => Promise<void>
}

const VacationTableMobile: React.FC<Props> = (props) => {
  const holidays = props.holidays().privateHolidays

  return (
    <Box>
      <Flex
        textAlign="left"
        align="center"
        h={35}>
        <Text
          w={175}
          fontSize="sm"
          fontWeight="bold"
          textTransform="uppercase">
          Periodo
        </Text>
        <Text
          w={35}
          mx={3}
          fontSize="sm"
          fontWeight="bold"
          textTransform="uppercase"
        >
          Días
        </Text>
        <Text
          fontSize="sm"
          fontWeight="bold"
          textTransform="uppercase">
          Estado
        </Text>
      </Flex>
      {holidays.length === 0 && <p>No tienes vacaciones</p>}
      <Accordion
        allowToggle
        allowMultiple>
        {holidays.map((value, index) => (
          <AccordionItem key={index}>
            <AccordionButton px={0}>
              <Flex
                flex={1}
                textAlign="left"
                align="center">
                <Text
                  w={175}
                  fontSize="sm">
                  {
                    formatVacationPeriod(value.days)
                  }
                </Text>
                <Text
                  w={35}
                  mx={3}
                  fontSize="sm">
                  {value.days.length}
                </Text>
                <VacationBadge state={value.state} />
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px={0}>
              <Text>Comentario: {value.userComment || '-'}</Text>
              <Text>Observaciones: {value.observations || '-'}</Text>
              {value.state === PrivateHolidayState.Pending && (
                <Stack
                  direction="row"
                  spacing={2}>
                  <Button
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    px={0}
                    onClick={() => props.onEdit(value)}
                  >
                    Editar
                  </Button>
                  <RemoveVacationButton
                    vacationId={value.id!}
                    onRefreshHolidays={props.onRefreshHolidays}
                    deleteVacationPeriod={props.deleteVacationPeriod}
                  />
                </Stack>
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  )
}

export default VacationTableMobile
