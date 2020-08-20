import React from 'react'
import { DataOrModifiedFn } from 'use-async-resource'
import {
  IHolidays,
  IPrivateHoliday,
  PrivateHolidayState
} from 'api/interfaces/IHolidays'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  Stack,
  Text
} from '@chakra-ui/core'
import { last } from 'utils/helpers'

interface Props {
  holidays: DataOrModifiedFn<IHolidays>
  onEdit: (privateHoliday: IPrivateHoliday) => void
  onRemove: (id: number) => void
}

export const VacationTable: React.FC<Props> = (props) => {
  const vacation = props.holidays().privateHolidays
  return (
    <Box>
      <Flex textAlign="left" align="center" h={35}>
        <Text w={175} fontSize="sm" fontWeight="bold" textTransform="uppercase">
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
        <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
          Estado
        </Text>
      </Flex>
      <Accordion allowToggle allowMultiple>
        {vacation.length === 0 && <p>No tienes vacaciones</p>}
        {vacation.map((value, index) => (
          <AccordionItem key={index}>
            <AccordionButton px={0}>
              <Flex flex={1} textAlign="left" align="center">
                <Text w={175} fontSize="sm">
                  {`${value.days[0].toLocaleDateString()} - ${last(
                    value.days
                  )!.toLocaleDateString()}`}
                </Text>
                <Text w={35} mx={3} fontSize="sm">
                  {value.days.length + 20}
                </Text>
                <VacationBadge state={value.state} />
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px={0}>
              <Text>Comentario: {value.userComment || '-'}</Text>
              <Text>Observaciones: {value.observations || '-'}</Text>
              {value.state === PrivateHolidayState.Pending && (
                <Stack direction="row" spacing={2}>
                  <Button
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    px={0}
                    onClick={() => props.onEdit(value)}
                  >
                    Editar
                  </Button>
                  <Button
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                    px={0}
                    onClick={() => props.onRemove(1)}
                  >
                    Eliminar
                  </Button>
                </Stack>
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  )
}

const VacationBadge: React.FC<{ state: PrivateHolidayState }> = ({ state }) => {
  if (state === PrivateHolidayState.Accept) {
    return <Badge colorScheme="green">Accept</Badge>
  }

  if (state === PrivateHolidayState.Pending) {
    return <Badge colorScheme="orange">Pending</Badge>
  }

  if (state === PrivateHolidayState.Cancelled) {
    return <Badge colorScheme="red">Cancelled</Badge>
  }

  return null
}
// <TableRow bg="gray.50">
// <Badge colorScheme="orange">Pending</Badge>
