import { useTranslation } from 'react-i18next'
import { useGlobalState } from '../../../../shared/arch/hooks/use-global-state'
import { SettingsState } from '../../../../shared/data-access/state/settings-state'
import { BinnacleState } from '../../data-access/state/binnacle-state'
import { Box, HStack, StackDivider, Text } from '@chakra-ui/react'
import { getDurationByHours } from '../../data-access/utils/getDuration'
import { observer } from 'mobx-react'
import { SelectWorkingBalanceMode } from './SelectWorkingBalanceMode'
import chrono from '../../../../shared/utils/chrono'

export const WorkingBalance = observer(() => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)
  const { selectedDate, selectedTimeBalanceMode, workingBalance } = useGlobalState(BinnacleState)

  const worked =
    selectedTimeBalanceMode === 'by-year'
      ? workingBalance?.annualBalance.worked
      : workingBalance?.monthlyBalances[chrono(selectedDate).format('M')].worked
  const target =
    selectedTimeBalanceMode === 'by-year'
      ? workingBalance?.annualBalance.targetWork
      : workingBalance?.monthlyBalances[chrono(selectedDate).format('M')].recommendedWork

  if (workingBalance === undefined) {
    return null
  }

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
      <HStack direction="row">
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
          <SelectWorkingBalanceMode />
        </Box>
      </HStack>
      <HStack
        direction="row"
        h="34px"
        justify={['space-between', 'initial']}
        divider={<StackDivider borderColor="gray.200" />}
      >
        {
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
        }
        <Box textAlign="left" minWidth="55px">
          {selectedTimeBalanceMode === 'by-year' ? (
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
      </HStack>
    </Box>
  )
})
