import { ChangeEvent, FC } from 'react'
import { Box, Flex, Select } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { TimeSummaryMode } from '../../../domain/selected-time-summary-mode'

type SelectTimeSummaryModeProps = {
  timeSummaryMode: TimeSummaryMode
  onChange(newValue: TimeSummaryMode): void
}
export const SelectTimeSummaryMode: FC<SelectTimeSummaryModeProps> = (props) => {
  const { timeSummaryMode, onChange } = props
  const { t } = useTranslation()

  const handleSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
    const optionSelected = event.target.value as TimeSummaryMode
    onChange(optionSelected)
  }

  return (
    <Box textAlign="left" textTransform="uppercase">
      <Flex align="center">
        <Select
          size="sm"
          variant="unstyled"
          onChange={handleSelect}
          value={timeSummaryMode}
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
}
