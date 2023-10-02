import { AvailabilityTableFilters } from '../availability-table-filters/availability-table-filters'
import { CalendarControls } from '../../../../../activity/ui/calendar-desktop/calendar-controls/calendar-controls'
import { Flex } from '@chakra-ui/react'
import { useIsMobile } from '../../../../../../../../shared/hooks/use-is-mobile'
import { FC } from 'react'
import { AbsenceFilters } from '../../../../domain/absence-filters'

interface Props {
  onFilterChange: (params: Partial<AbsenceFilters>) => void
}

export const AvailabilityTableHeader: FC<Props> = ({ onFilterChange }) => {
  const isMobile = useIsMobile()

  return (
    <Flex
      align="center"
      justify="space-between"
      border="none"
      marginBottom="16px"
      flexDirection={isMobile ? 'column' : 'row'}
      gap={isMobile ? 3 : 0}
    >
      <AvailabilityTableFilters onChange={onFilterChange} />
      <CalendarControls />
    </Flex>
  )
}
