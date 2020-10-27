// @ts-ignore
import React, { ChangeEvent, unstable_useTransition as useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { useBinnacleResources } from 'core/providers/BinnacleResourcesProvider'
import { getTimeColor, getTimeDuration } from 'pages/binnacle/TimeBalance/TimeBalance.utils'
import { SUSPENSE_CONFIG } from 'core/utils/constants'
import { Box, Flex, StackDivider, Text, Spinner, Select, HStack } from '@chakra-ui/core'
import { useSettings } from 'pages/settings/Settings.utils'
import chrono from 'core/services/Chrono'
import { getDuration } from 'pages/binnacle/BinnaclePage.utils'

export const TimeBalance: React.FC = () => {
  const { t } = useTranslation()
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const settings = useSettings()
  const { selectedMonth, timeBalanceMode, timeReader, fetchTimeResource } = useBinnacleResources()
  const timeData = timeReader()

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const optionSelected = event.target.value

    if (optionSelected === 'by_month') {
      startTransition(() => {
        fetchTimeResource('by_month')
      })
    } else {
      startTransition(() => {
        fetchTimeResource('by_year')
      })
    }
  }

  const showTimeDifference =
    chrono(selectedMonth).isThisMonth() || chrono(selectedMonth).isBefore(new Date())

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
        <Box textAlign="left" minWidth="55px">
          {t('time_tracking.imputed_hours')}
          <Text
            data-testid="time_worked_value"
            textTransform="initial"
            fontWeight="600"
            textAlign="left"
            fontSize="sm"
          >
            {getDuration(timeData.timeWorked, settings.useDecimalTimeFormat)}
          </Text>
        </Box>
        <Box textAlign="left" minWidth="55px">
          {timeBalanceMode === 'by_year'
            ? chrono(selectedMonth).format('yyyy')
            : chrono(selectedMonth).format('MMMM')}
          <Text
            data-testid="time_to_work_value"
            textTransform="initial"
            fontWeight="600"
            textAlign="left"
            fontSize="sm"
          >
            {getDuration(timeData.timeToWork, settings.useDecimalTimeFormat)}
          </Text>
        </Box>
        {showTimeDifference && (
          <Box textAlign="left" textTransform="uppercase">
            <Flex align="center">
              <Select
                size="sm"
                variant="unstyled"
                onChange={handleSelect}
                value={timeBalanceMode}
                data-testid="select"
                height="unset"
                textTransform="uppercase"
                fontSize="10px"
              >
                <option data-testid="balance_by_month_button" value="by_month">
                  {t('time_tracking.month_balance')}
                </option>
                <option data-testid="balance_by_year_button" value="by_year">
                  {t('time_tracking.year_balance')}
                </option>
              </Select>
              {isPending && <Spinner size="xs" label={t('accessibility.loading')} />}
            </Flex>
            <Text
              data-testid="time_balance_value"
              textTransform="initial"
              fontWeight="600"
              textAlign="left"
              fontSize="sm"
              color={getTimeColor(timeData.timeDifference)}
            >
              {getTimeDuration(timeData.timeDifference, settings.useDecimalTimeFormat)}
            </Text>
          </Box>
        )}
      </HStack>
    </Box>
  )
}
