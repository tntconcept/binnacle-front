import { Box, HStack, StackDivider, Text, useColorModeValue } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useGlobalState } from '../../../../shared/arch/hooks/use-global-state'
import { SettingsState } from '../../../../shared/data-access/state/settings-state'
import chrono from '../../../../shared/utils/chrono'
import { BinnacleState } from '../../data-access/state/binnacle-state'
import { getDurationByHours } from '../../data-access/utils/getDuration'
import { SelectWorkingTimeMode } from './SelectWorkingTimeMode'

export const WorkingTime = observer(() => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)
  const { selectedDate, selectedWorkingTimeMode, workingTime } = useGlobalState(BinnacleState)

  const [hourBalance, setHourBalance] = useState(0)
  const [isNegativeBalance, setIsNegativeBalance] = useState(false)
  const balancePositiveColor = useColorModeValue('green.600', 'green.200')
  const balanceNegativeColor = useColorModeValue('red.600', 'red.200')

  const currentMonthIndex = chrono(selectedDate).format('M')
  console.log('currentMonthIndex: ' + parseInt(currentMonthIndex, 10))
  console.log('workintime months: ' + workingTime?.months[13])

  const worked =
    selectedWorkingTimeMode === 'by-year'
      ? workingTime?.year.current.worked
      : workingTime?.months[Number(currentMonthIndex) - 1].worked

  const target =
    selectedWorkingTimeMode === 'by-year'
      ? workingTime?.year.current.target
      : workingTime?.months[Number(currentMonthIndex) - 1].recommended

  const notConsumedVacations = Number(workingTime?.year.current.notConsumedVacations)
  const plus = ' + '
  const showNotConsumedVacations = (notConsumedVacations: number) => {
    if (selectedWorkingTimeMode === 'by-year' && notConsumedVacations > 0) {
      return (
        <>
          <Text> {t('time_tracking.target_hours_and_ncv')}</Text>
          <Text
            data-testid="time_tracking_hours"
            textTransform="initial"
            fontWeight="600"
            textAlign="left"
            fontSize="sm"
          >
            {(target ?? 0) + notConsumedVacations + 'h'}
            {' (' + getDurationByHours(target ?? 0, settings.useDecimalTimeFormat)}
            {plus + notConsumedVacations + 'h v.n.c' + ')'}
          </Text>
        </>
      )
    } else {
      return (
        <>
          <Text> {t('time_tracking.recommended_hours')}</Text>
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

  useEffect(() => {
    const hourBalance = (worked ?? 0) - (target ?? 0)
    setHourBalance(Number(hourBalance.toFixed(2) ?? 0))
    setIsNegativeBalance(hourBalance < 0)
  }, [worked, target])

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

        <Box textAlign="left" minWidth="55px">
          {showNotConsumedVacations(notConsumedVacations)}
        </Box>

        <Box textAlign="left" minWidth="55px">
          <Text>Balance</Text>
          <Text
            textTransform="initial"
            fontWeight="600"
            textAlign="left"
            fontSize="sm"
            color={isNegativeBalance ? balanceNegativeColor : balancePositiveColor}
          >
            <span aria-label={t(isNegativeBalance ? 'accessibility.minus' : 'accessibility.plus')}>
              {isNegativeBalance ? '-' : '+'}
            </span>
            {getDurationByHours(Math.abs(hourBalance), settings.useDecimalTimeFormat)}
          </Text>
        </Box>
      </HStack>
    </Box>
  )
})
