import { FC } from 'react'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { useTranslation } from 'react-i18next'
import { AvailabilityTable } from './components/availability-table'
import { Box } from '@chakra-ui/react'

const AvailabilityPage: FC = () => {
  const { t } = useTranslation()

  return (
    <PageWithTitle title={t('pages.availability')}>
      <Box as="main" display="flex" flexDirection="column" overflowX="auto" overflowY="hidden">
        <AvailabilityTable />
      </Box>
    </PageWithTitle>
  )
}

export default AvailabilityPage
