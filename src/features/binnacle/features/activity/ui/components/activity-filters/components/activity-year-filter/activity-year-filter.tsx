import { Box, FormLabel, Select } from '@chakra-ui/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const ActivityYearFilter: FC<{ onChange: (year: number) => void }> = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <Box>
      <FormLabel>{t('activity_state_filter.select_year')}</FormLabel>
      <Select defaultValue={currentYear}>
        <option value={currentYear}>{currentYear}</option>
      </Select>
    </Box>
  )
}
