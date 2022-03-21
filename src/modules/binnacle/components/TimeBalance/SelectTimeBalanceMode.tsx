import { Box, Flex, Select, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { getTimeColor } from 'modules/binnacle/components/TimeBalance/utils/getTimeColor'
import { getTimeDuration } from 'modules/binnacle/components/TimeBalance/utils/getTimeDuration'
import { GetTimeBalanceByMonthAction } from 'modules/binnacle/data-access/actions/get-time-balance-by-month-action'
import { GetTimeBalanceByYearAction } from 'modules/binnacle/data-access/actions/get-time-balance-by-year-action'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionLoadable } from 'shared/arch/hooks/use-action-loadable'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { SettingsState } from 'shared/data-access/state/settings-state'

interface Props {
  timeDifference: number
}

export const SelectTimeBalanceMode = observer((props: Props) => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)
  const { selectedTimeBalanceMode } = useGlobalState(BinnacleState)

  const [getTimeBalanceByMonth, isLoadingByMonth] = useActionLoadable(GetTimeBalanceByMonthAction)
  const [getTimeBalanceByYear, isLoadingByYear] = useActionLoadable(GetTimeBalanceByYearAction)

  const handleSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
    const optionSelected = event.target.value

    if (optionSelected === 'by-month') {
      await getTimeBalanceByMonth(undefined)
    } else {
      await getTimeBalanceByYear(undefined)
    }
  }

  const isLoading = isLoadingByMonth || isLoadingByYear

  return (
    <Box textAlign="left" textTransform="uppercase">
      <Flex align="center">
        <Select
          size="sm"
          variant="unstyled"
          onChange={handleSelect}
          value={selectedTimeBalanceMode}
          data-testid="select"
          height="unset"
          textTransform="uppercase"
          fontSize="10px"
        >
          <option data-testid="balance_by_month_button" value="by-month">
            {t('time_tracking.month_balance')}
          </option>
          <option data-testid="balance_by_year_button" value="by-year">
            {t('time_tracking.year_balance')}
          </option>
        </Select>
        {isLoading && <Spinner size="xs" label={t('accessibility.loading')} />}
      </Flex>
      <Text
        data-testid="time_balance_value"
        textTransform="initial"
        fontWeight="600"
        textAlign="left"
        fontSize="sm"
        color={getTimeColor(props.timeDifference)}
      >
        {getTimeDuration(props.timeDifference, settings.useDecimalTimeFormat)}
      </Text>
    </Box>
  )
})
