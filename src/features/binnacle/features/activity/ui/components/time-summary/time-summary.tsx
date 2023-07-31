import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Box, HStack, StackDivider, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from '../../../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { ApproveActivityCmd } from '../../../application/approve-activity-cmd'
import { CreateActivityCmd } from '../../../application/create-activity-cmd'
import { DeleteActivityCmd } from '../../../application/delete-activity-cmd'
import { GetTimeSummaryQry } from '../../../application/get-time-summary-qry'
import { UpdateActivityCmd } from '../../../application/update-activity-cmd'
import { TimeSummaryMode } from '../../../domain/selected-time-summary-mode'
import { getDurationByHours } from '../../../utils/get-duration'
import { useCalendarContext } from '../../contexts/calendar-context'
import { useGetSelectedCalendarDate } from '../../hooks/use-get-selected-calendar-date'
import { YearBalanceButton } from '../year-balance/year-balance-button'
import { SelectTimeSummaryMode } from './select-time-summary-mode'
import { TimeSummarySkeleton } from './time-summary-skeleton'

export const TimeSummary: FC = () => {
  const { t } = useTranslation()
  const { shouldUseDecimalTimeFormat, selectedDate } = useCalendarContext()
  const [timeSummaryModeSelected, setTimeSummaryModeSelected] =
    useState<TimeSummaryMode>('by-month')
  const currentDate = useGetSelectedCalendarDate(selectedDate)

  const {
    isLoading,
    result: timeSummary,
    executeUseCase: getTimeSummaryQry
  } = useExecuteUseCaseOnMount(GetTimeSummaryQry, currentDate)

  const [isNegativeAnnualBalance, setIsNegativeAnnualBalance] = useState(false)
  const [isNegativeMonthlyBalance, setIsNegativeMonthlyBalance] = useState(false)
  const balancePositiveColor = useColorModeValue('green.600', 'green.200')
  const balanceNegativeColor = useColorModeValue('red.600', 'red.200')

  const currentMonthIndex = chrono(selectedDate).format('M')

  const addSignToBalance = true

  const worked =
    timeSummaryModeSelected === 'by-year'
      ? timeSummary?.year.current.worked
      : timeSummary?.months[Number(currentMonthIndex) - 1].worked

  const target =
    timeSummaryModeSelected === 'by-year'
      ? timeSummary?.year.current.target
      : timeSummary?.months[Number(currentMonthIndex) - 1].recommended

  const balanceByMonth = timeSummary?.months[Number(currentMonthIndex) - 1].balance
  const annualBalance = timeSummary?.year.current.balance ?? 0
  const notRequestedVacations = Number(timeSummary?.year.current.notRequestedVacations)
  const plus = ' + '
  const ncvPlusTarget = notRequestedVacations + (target ?? 0)
  const formatHours = (value: number) => {
    if (!shouldUseDecimalTimeFormat) {
      return value.toString() + 'h '
    }
    return value.toString()
  }

  const tooltipParser = t('tooltip_nrv_info.information_message', {
    target_hours_nrv: formatHours(ncvPlusTarget ?? 0),
    target_annual_hours: formatHours(target ?? 0),
    notRequestedVacations_info: formatHours(notRequestedVacations)
  })

  const showNotRequestedVacations = (notRequestedVacations: number) => {
    if (timeSummaryModeSelected === 'by-year' && notRequestedVacations > 0) {
      return (
        <>
          <Text>
            {' '}
            {t('tooltip_nrv_info.target_and_vns_title')}{' '}
            <Tooltip label={tooltipParser} placement="bottom">
              <InfoOutlineIcon></InfoOutlineIcon>
            </Tooltip>
          </Text>
          <Text
            data-testid="time_tracking_hours"
            textTransform="initial"
            fontWeight="600"
            textAlign="left"
            fontSize="sm"
          >
            {formatHours(notRequestedVacations + (target ?? 0))}
            {' (' + getDurationByHours(target ?? 0, shouldUseDecimalTimeFormat)}
            {plus + formatHours(notRequestedVacations) + t('time_tracking.vacation_acronym') + ')'}
          </Text>
        </>
      )
    } else {
      return (
        <>
          <Text> {t('time_tracking.target_hours')}</Text>
          <Text
            data-testid="time_tracking_hours"
            textTransform="initial"
            fontWeight="600"
            textAlign="left"
            fontSize="sm"
          >
            {getDurationByHours(target ?? 0, shouldUseDecimalTimeFormat)}
          </Text>
        </>
      )
    }
  }

  const showBalance = () => {
    if (timeSummaryModeSelected === 'by-year') {
      return (
        <>
          <Text>Balance</Text>
          <Text
            textTransform="initial"
            fontWeight="600"
            textAlign="left"
            fontSize="sm"
            color={isNegativeAnnualBalance ? balanceNegativeColor : balancePositiveColor}
          >
            {getDurationByHours(annualBalance, shouldUseDecimalTimeFormat, addSignToBalance)}
          </Text>
        </>
      )
    } else {
      return (
        <>
          <Text>Balance</Text>
          <Text
            textTransform="initial"
            fontWeight="600"
            textAlign="left"
            fontSize="sm"
            color={isNegativeMonthlyBalance ? balanceNegativeColor : balancePositiveColor}
          >
            {getDurationByHours(balanceByMonth ?? 0, shouldUseDecimalTimeFormat, addSignToBalance)}
          </Text>
        </>
      )
    }
  }

  useSubscribeToUseCase(
    CreateActivityCmd,
    () => {
      getTimeSummaryQry(currentDate)
    },
    [currentDate]
  )

  useSubscribeToUseCase(
    UpdateActivityCmd,
    () => {
      getTimeSummaryQry(currentDate)
    },
    [currentDate]
  )

  useSubscribeToUseCase(
    DeleteActivityCmd,
    () => {
      getTimeSummaryQry(currentDate)
    },
    [currentDate]
  )

  useSubscribeToUseCase(
    ApproveActivityCmd,
    () => {
      getTimeSummaryQry(currentDate)
    },
    [currentDate]
  )

  useEffect(() => {
    const hourAnnualBalance = timeSummary?.year.current.balance ?? 0
    const hourMonthlyBalance = timeSummary?.months[Number(currentMonthIndex) - 1].balance ?? 0
    setIsNegativeAnnualBalance(hourAnnualBalance < 0)
    setIsNegativeMonthlyBalance(hourMonthlyBalance < 0)
  }, [worked, target, notRequestedVacations])

  return isLoading ? (
    <TimeSummarySkeleton />
  ) : (
    <Box
      as="fieldset"
      textAlign="left"
      border="none"
      p={['0 24px', '0']}
      m={0}
      textTransform="uppercase"
      fontSize="10px"
    >
      <HStack direction="row" spacing={[0, 1]}>
        <Box
          as="legend"
          p="0"
          fontSize="xs"
          fontWeight="600"
          display={['none', 'table']}
          marginRight="2px"
        >
          {t('time_tracking.description')}
        </Box>
        <Box>
          <SelectTimeSummaryMode
            timeSummaryMode={timeSummaryModeSelected}
            onChange={setTimeSummaryModeSelected}
          />
        </Box>
      </HStack>
      <HStack
        direction="row"
        h="34px"
        justify={['space-between', 'initial']}
        divider={<StackDivider borderColor="gray.200" />}
      >
        <Box textAlign="left" minWidth="55px">
          {t('time_tracking.worked_hours')}
          <Text
            data-testid="time_worked_value"
            textTransform="initial"
            fontWeight="600"
            textAlign="left"
            fontSize="sm"
          >
            {getDurationByHours(worked ?? 0, shouldUseDecimalTimeFormat)}
          </Text>
        </Box>

        <Box textAlign="left" minWidth="55px" maxWidth="1200px">
          {showNotRequestedVacations(notRequestedVacations)}
        </Box>

        <Box textAlign="left" minWidth="55px">
          {showBalance()}
        </Box>

        <YearBalanceButton />
      </HStack>
    </Box>
  )
}
