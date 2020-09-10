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
  onRefreshHolidays: (year: number) => void
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
          w="40px"
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
        {holidays.map((holiday, index) => (
          <AccordionItem key={index}>
            <AccordionButton px={0}>
              <Flex flex={1} textAlign="left" align="center">
                <Text w={175} fontSize="sm">
                  {formatVacationPeriod(holiday.startDate, holiday.endDate)}
                </Text>
                <Text w="40px" mx={3} fontSize="sm">
                  {holiday.days.length}
                </Text>
                <VacationBadge state={holiday.state} />
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px={0}>
              <Text>
                {t('vacation_table.description')}: {holiday.userComment || '-'}
              </Text>
              <Text>
                {t('vacation_table.observations')}: {holiday.observations || '-'}
              </Text>
              {holiday.state === PrivateHolidayState.Pending && (
                <Stack direction="row" spacing={2}>
                  <Button
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    onClick={() => props.onEdit(holiday)}
                  >
                    {t('actions.edit')}
                  </Button>
                  <RemoveVacationButton
                    vacation={holiday}
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
