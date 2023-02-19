import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Box, HStack, StackDivider, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from '../../../../shared/arch/hooks/use-global-state'
import { SettingsState } from '../../../../shared/data-access/state/settings-state'
import chrono from '../../../../shared/utils/chrono'
import { BinnacleState } from '../../data-access/state/binnacle-state'
import { getDurationByHours } from '../../data-access/utils/getDuration'
import { YearBalanceButton } from '../YearBalance/YearBalanceButton'
import { SelectWorkingTimeMode } from './SelectWorkingTimeMode'

export const WorkingTime = observer(() => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)
  const { selectedDate, selectedWorkingTimeMode, timeSummary } = useGlobalState(BinnacleState)

  const [isNegativeAnnualBalance, setIsNegativeAnnualBalance] = useState(false)
  const [isNegativeMonthlyBalance, setIsNegativeMonthlyBalance] = useState(false)
  const balancePositiveColor = useColorModeValue('green.600', 'green.200')
  const balanceNegativeColor = useColorModeValue('red.600', 'red.200')

  const currentMonthIndex = chrono(selectedDate).format('M')

  const addSignToBalance = true

  const worked =
    selectedWorkingTimeMode === 'by-year'
      ? timeSummary?.year.current.worked
      : timeSummary?.months[Number(currentMonthIndex) - 1].worked

  const target =
    selectedWorkingTimeMode === 'by-year'
      ? timeSummary?.year.current.target
      : timeSummary?.months[Number(currentMonthIndex) - 1].recommended

  const balanceByMonth = timeSummary?.months[Number(currentMonthIndex) - 1].balance
  const annualBalance = timeSummary?.year.current.balance ?? 0
  const notRequestedVacations = Number(timeSummary?.year.current.notRequestedVacations)
  const plus = ' + '
  const ncvPlusTarget = notRequestedVacations + (target ?? 0)
  const formatHours = (value: number) => {
    if (!settings.useDecimalTimeFormat) {
      return value.toString() + 'h '
    }
    return value.toString()
  }

  const tooltipParser = t('tooltip_nrv_info.information_message', {
    target_hours_nrv: formatHours(ncvPlusTarget ?? 0),
    target_annual_hours: formatHours(target ?? 0),
    notRequestedVacations_info: formatHours(notRequestedVacations)
  })

  const shownotRequestedVacations = (notRequestedVacations: number) => {
    if (selectedWorkingTimeMode === 'by-year' && notRequestedVacations > 0) {
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
            {' (' + getDurationByHours(target ?? 0, settings.useDecimalTimeFormat)}
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
            {getDurationByHours(target ?? 0, settings.useDecimalTimeFormat)}
          </Text>
        </>
      )
    }
  }

  const showBalance = () => {
    if (selectedWorkingTimeMode === 'by-year') {
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
            {getDurationByHours(annualBalance, settings.useDecimalTimeFormat, addSignToBalance)}
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
            {getDurationByHours(
              balanceByMonth ?? 0,
              settings.useDecimalTimeFormat,
              addSignToBalance
            )}
          </Text>
        </>
      )
    }
  }

  useEffect(() => {
    const hourAnnualBalance = timeSummary?.year.current.balance ?? 0
    const hourMonthlyBalance = timeSummary?.months[Number(currentMonthIndex) - 1].balance ?? 0
    setIsNegativeAnnualBalance(hourAnnualBalance < 0)
    setIsNegativeMonthlyBalance(hourMonthlyBalance < 0)
  }, [worked, target, notRequestedVacations])

  return (
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
          <SelectWorkingTimeMode />
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
            {getDurationByHours(worked ?? 0, settings.useDecimalTimeFormat)}
          </Text>
        </Box>

        <Box textAlign="left" minWidth="55px" maxWidth="1200px">
          {shownotRequestedVacations(notRequestedVacations)}
        </Box>

        <Box textAlign="left" minWidth="55px">
          {showBalance()}
        </Box>

        <YearBalanceButton />
      </HStack>
    </Box>
  )
})
