import { Flex } from '@chakra-ui/react'
import { ActivityUserFilter } from './components/activity-user-filter/activity-user-filter'
import { ActivityStateFilter } from './components/activity-state-filter/activity-state-filter'
import { FC } from 'react'
import { GetActivitiesQueryParams } from '../../../domain/get-activities-query-params'
import { ActivityApprovalStateFilter } from '../../../domain/activity-approval-state-filter'
import { UserInfo } from '../../../../../../shared/user/domain/user-info'

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
        onChange={(param?: UserInfo) => handleChange({ userId: param?.id })}
      ></ActivityUserFilter>
      <ActivityStateFilter
        defaultValue={props.defaultValues.approvalState}
        onChange={(param: ActivityApprovalStateFilter) => handleChange({ approvalState: param })}
      ></ActivityStateFilter>
    </Flex>
  )
}
