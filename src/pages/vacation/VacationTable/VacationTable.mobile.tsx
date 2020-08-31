import { DataOrModifiedFn } from 'use-async-resource/src/index'
import {
  IHolidays,
  IPrivateHoliday,
  PrivateHolidayState
} from 'api/interfaces/IHolidays'
import React from 'react'
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
import { VacationBadge } from './VacationStateBadge'
import { RemoveVacationButton } from './RemoveVacationButton'
import { formatVacationPeriod } from './VacationTable.utils'
import { useTranslation } from 'react-i18next'

interface Props {
  holidays: DataOrModifiedFn<IHolidays>
  onEdit: (privateHoliday: IPrivateHoliday) => void
  onRefreshHolidays: () => void
  deleteVacationPeriod: (id: number) => Promise<void>
}

const VacationTableMobile: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const holidays = props.holidays().privateHolidays

  return (
    <Box>
      <Flex textAlign="left" align="center" h={35}>
        <Text w={175} fontSize="sm" fontWeight="bold" textTransform="uppercase">
          {t('vacation_table.period')}
        </Text>
        <Text
          w={36}
          mx={3}
          fontSize="sm"
          fontWeight="bold"
          textTransform="uppercase"
        >
          {t('vacation_table.days')}
        </Text>
        <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
          {t('vacation_table.state')}
        </Text>
      </Flex>
      {holidays.length === 0 && <p>{t('vacation_table.empty')}</p>}
      <Accordion allowToggle allowMultiple>
        {holidays.map((value, index) => (
          <AccordionItem key={index}>
            <AccordionButton px={0}>
              <Flex flex={1} textAlign="left" align="center">
                <Text w={175} fontSize="sm">
                  {formatVacationPeriod(value.days)}
                </Text>
                <Text w={36} mx={3} fontSize="sm">
                  {value.days.length}
                </Text>
                <VacationBadge state={value.state} />
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px={0}>
              <Text>
                {t('vacation_table.description')}: {value.userComment || '-'}
              </Text>
              <Text>
                {t('vacation_table.observations')}: {value.observations || '-'}
              </Text>
              {value.state === PrivateHolidayState.Pending && (
                <Stack direction="row" spacing={2}>
                  <Button
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    px={0}
                    onClick={() => props.onEdit(value)}
                  >
                    {t('actions.edit')}
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
