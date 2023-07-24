import { Box, FormLabel, Select } from '@chakra-ui/react'
import { ChangeEvent, FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onChange: (year: number) => void
  defaultValue: number
}

export const ActivityYearFilter: FC<Props> = (props) => {
  const { t } = useTranslation()
  const startYear = 2020
  const currentYear = new Date().getFullYear()

  const getYearsBetweenRange = (startYear: number, endYear: number) => {
    const result = []
    for (let i = startYear; i <= endYear; i++) {
      result.push(i)
    }
    return result
  }
  const yearOptions = useMemo(() => getYearsBetweenRange(startYear, currentYear), [currentYear])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const optionSelected = parseInt(event.target.value)
    props.onChange(optionSelected)
  }

  return (
    <Box>
      <FormLabel>{t('activity_state_filter.select_year')}</FormLabel>
      <Select
        height={47}
        borderRadius={4}
        data-testid="select"
        onChange={handleChange}
        defaultValue={props.defaultValue}
      >
        {yearOptions.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </Select>
    </Box>
  )
}
