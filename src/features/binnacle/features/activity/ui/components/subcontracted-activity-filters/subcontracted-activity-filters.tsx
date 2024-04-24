import { Flex } from '@chakra-ui/react'
import { FC } from 'react'
import { GetSubcontractedActivitiesQueryParams } from '../../../domain/get-subcontracted-activities-query-params'
import { ActivityYearFilter } from '../activity-filters/components/activity-year-filter/activity-year-filter'

export const SubcontractedActivityFilters: FC<{
  defaultValues: GetSubcontractedActivitiesQueryParams
  onChange: (params: Partial<GetSubcontractedActivitiesQueryParams>) => void
}> = (props) => {
  const handleChange = (params: Partial<GetSubcontractedActivitiesQueryParams>) => {
    props.onChange(params)
  }

  return (
    <Flex marginBottom={5} gap={3}>
      <ActivityYearFilter
        defaultValue={new Date(props.defaultValues.startDate).getFullYear()}
        onChange={(year: number) =>
          handleChange({ startDate: `${year}-01-01`, endDate: `${year}-12-31` })
        }
      ></ActivityYearFilter>
    </Flex>
  )
}
