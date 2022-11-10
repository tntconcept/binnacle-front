import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react'
import { Box, HStack, StackDivider, Text } from '@chakra-ui/react'

import { useGlobalState } from '../../../../shared/arch/hooks/use-global-state'
import { SettingsState } from '../../../../shared/data-access/state/settings-state'
import { BinnacleState } from '../../data-access/state/binnacle-state'
import { getDurationByHours } from '../../data-access/utils/getDuration'
import chrono from '../../../../shared/utils/chrono'
import { SelectWorkingTimeMode } from './SelectWorkingTimeMode'
import { isPastMonth } from 'shared/utils/isPastMonth'

export const WorkingTime = observer(() => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)
  const { selectedDate, selectedWorkingTimeMode, workingTime } = useGlobalState(BinnacleState)

  const [hourBalance, setHourBalance] = useState(0)
  const [isNegativeBalance, setIsNegativeBalance] = useState(false)

  const [hideRecommended, setHideRecommended] = useState(false)

  useEffect(() => {
    const isPast = isPastMonth(selectedDate)
    setHideRecommended(isPast)
  }, [selectedDate])

  const currentMonthIndex = chrono(selectedDate).format('M')

  const worked =
    selectedWorkingTimeMode === 'by-year'
      ? workingTime?.annualBalance.worked
      : workingTime?.monthlyBalances[currentMonthIndex].worked
  const target =
    selectedWorkingTimeMode === 'by-year'
      ? workingTime?.annualBalance.targetWork
      : workingTime?.monthlyBalances[currentMonthIndex].recommendedWork

  useEffect(() => {
    const hourBalance = (worked ?? 0) - (target ?? 0)
    setHourBalance(hourBalance)
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

        {!hideRecommended && (
          <Box textAlign="left" minWidth="55px">
            {selectedWorkingTimeMode === 'by-year' ? (
              <Text> {t('time_tracking.target_hours')}</Text>
            ) : (
              <Text>{t('time_tracking.recommended_hours')}</Text>
            )}
            <Text
              data-testid="time_tracking_hours"
              textTransform="initial"
              fontWeight="600"
              textAlign="left"
              fontSize="sm"
            >
              {getDurationByHours(target ?? 0, settings.useDecimalTimeFormat)}
            </Text>
          </Box>
        )}

        {!hideRecommended && (
          <Box textAlign="left" minWidth="55px">
            <Text>Balance</Text>
            <Text
              textTransform="initial"
              fontWeight="600"
              textAlign="left"
              fontSize="sm"
              color={isNegativeBalance ? 'red.200' : 'green.200'}
            >
              <span
                aria-label={t(isNegativeBalance ? 'accessibility.minus' : 'accessibility.plus')}
              >
                {isNegativeBalance ? '-' : '+'}
              </span>
              {getDurationByHours(Math.abs(hourBalance), settings.useDecimalTimeFormat)}
            </Text>
          </Box>
        )}
      </HStack>
    </Box>
  )
})
