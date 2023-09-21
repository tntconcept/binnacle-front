import { FC } from 'react'
import { PageWithTitle } from '../../../../../shared/components/page-with-title/page-with-title'
import { useTranslation } from 'react-i18next'
import { AvailabilityTable } from './components/availability-table'
import { Box, Flex } from '@chakra-ui/react'
import { CalendarControls } from '../../activity/ui/calendar-desktop/calendar-controls/calendar-controls'
import { CalendarProvider } from '../../activity/ui/contexts/calendar-context'

const AvailabilityPage: FC = () => {
  const { t } = useTranslation()

  return (
    <PageWithTitle title={t('pages.availability')}>
      <CalendarProvider>
        <Flex
          as="section"
          align="center"
          justify="space-between"
          border="none"
          margin="0 32px 16px 34px"
        >
          <Flex />
          <CalendarControls />
        </Flex>
        <Box as="main" display="flex" flexDirection="column" overflowX="auto" overflowY="hidden">
          <AvailabilityTable />
        </Box>
      </CalendarProvider>
    </PageWithTitle>
  )
}

export default AvailabilityPage
