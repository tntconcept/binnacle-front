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

/*
import { Flex } from '@chakra-ui/react'
import { ActivityUserFilter } from './components/activity-user-filter/activity-user-filter'
import { ActivityStateFilter } from './components/activity-state-filter/activity-state-filter'
import { FC } from 'react'
import { GetActivitiesQueryParams } from '../../../domain/get-activities-query-params'
import { ActivityApprovalStateFilter } from '../../../domain/activity-approval-state-filter'
import { UserInfo } from '../../../../../../shared/user/domain/user-info'
import { ActivityYearFilter } from './components/activity-year-filter/activity-year-filter'

export const ActivityFilters: FC<{
  defaultValues: GetActivitiesQueryParams
  onChange: (params: Partial<GetActivitiesQueryParams>) => void
}> = (props) => {
  const handleChange = (params: Partial<GetActivitiesQueryParams>) => {
    props.onChange(params)
  }

  return (
    <Flex marginBottom={5} gap={3}>
      <ActivityUserFilter
        onChange={(userInfo?: UserInfo) => handleChange({ userId: userInfo?.id })}
      ></ActivityUserFilter>
      <ActivityStateFilter
        defaultValue={props.defaultValues.approvalState}
        onChange={(approvalState: ActivityApprovalStateFilter) => handleChange({ approvalState })}
      ></ActivityStateFilter>
      <ActivityYearFilter
        defaultValue={new Date(props.defaultValues.startDate).getFullYear()}
        onChange={(year: number) =>
          handleChange({ startDate: `${year}-01-01`, endDate: `${year}-12-31` })
        }
      ></ActivityYearFilter>
    </Flex>
  )
}
*/
