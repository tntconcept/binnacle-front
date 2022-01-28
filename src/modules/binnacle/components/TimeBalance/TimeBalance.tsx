import { Box, HStack, StackDivider, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { SelectTimeBalanceMode } from 'modules/binnacle/components/TimeBalance/SelectTimeBalanceMode'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { getDuration } from 'modules/binnacle/data-access/utils/getDuration'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { AppState } from 'shared/data-access/state/app-state'
import { SettingsState } from 'shared/data-access/state/settings-state'
import chrono from 'shared/utils/chrono'

export const TimeBalance = observer(() => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)
  const { loggedUser } = useGlobalState(AppState)
  const { selectedDate, selectedTimeBalanceMode, timeBalance } = useGlobalState(BinnacleState)

  if (timeBalance === undefined) {
    return null
  }

  const showTimeDifference =
    chrono(selectedDate).isThisMonth() || chrono(selectedDate).isBefore(chrono.now())

  const isTimeToWorkVisible = () => {
    const hDate = chrono(loggedUser!.hiringDate).getDate()
    return chrono(selectedDate).isSame(hDate, 'month') || chrono(selectedDate).isAfter(hDate)
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
      <Box as="legend" p="0" fontSize="xs" fontWeight="600" display={['none', 'table']}>
        {t('time_tracking.description')}
      </Box>
      <HStack
        direction="row"
        h="34px"
        justify={['space-between', 'initial']}
        divider={<StackDivider borderColor="gray.200" />}
      >
        {isTimeToWorkVisible() && (
          <Box textAlign="left" minWidth="55px">
            {t('time_tracking.imputed_hours')}
            <Text
              data-testid="time_worked_value"
              textTransform="initial"
              fontWeight="600"
              textAlign="left"
              fontSize="sm"
            >
              {getDuration(timeBalance!.timeWorked, settings.useDecimalTimeFormat)}
            </Text>
          </Box>
        )}
        <Box textAlign="left" minWidth="55px">
          {selectedTimeBalanceMode === 'by-year'
            ? chrono(selectedDate).format('yyyy')
            : chrono(selectedDate).format('MMMM')}
          <Text
            data-testid="time_to_work_value"
            textTransform="initial"
            fontWeight="600"
            textAlign="left"
            fontSize="sm"
          >
            {getDuration(timeBalance!.timeToWork, settings.useDecimalTimeFormat)}
          </Text>
        </Box>
        {showTimeDifference && isTimeToWorkVisible() && (
          <SelectTimeBalanceMode timeDifference={timeBalance!.timeDifference} />
        )}
      </HStack>
    </Box>
  )
})
