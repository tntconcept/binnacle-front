import { observer } from 'mobx-react'
import { useGlobalState } from '../../../../shared/arch/hooks/use-global-state'
import { BinnacleState } from '../../data-access/state/binnacle-state'
import { ChangeEvent } from 'react'
import { Box, Flex, Select } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { SelectedTimeBalanceMode } from '../../data-access/interfaces/selected-time-balance-mode'
import { runInAction } from 'mobx'

export const SelectWorkingBalanceMode = observer(() => {
  const { t } = useTranslation()
  const binnacleState = useGlobalState(BinnacleState)

  const handleSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
    const optionSelected = event.target.value
    runInAction(() => {
      binnacleState.selectedTimeBalanceMode = optionSelected as SelectedTimeBalanceMode
    })
  }

  return (
    <Box textAlign="left" textTransform="uppercase">
      <Flex align="center">
        <Select
          size="sm"
          variant="unstyled"
          onChange={handleSelect}
          value={binnacleState.selectedTimeBalanceMode}
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
      </Flex>
    </Box>
  )
})
