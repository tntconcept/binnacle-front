import { Box, Flex, Select } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { ChangeEvent, FC } from 'react'

export const ActivityStateFilter: FC<{ onChange: (state: string) => void }> = (props) => {
  const { t } = useTranslation()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const optionSelected = event.target.value
    props.onChange(optionSelected)
  }

  return (
    <Flex as="form">
      <Box>
        <Select defaultValue="pending" onChange={handleChange}>
          <option value="pending">{t('activity.pending_state')}</option>
          <option value="accepted">{t('activity.accepted_state')}</option>
          <option value="all">All</option>
        </Select>
      </Box>
    </Flex>
  )
}
