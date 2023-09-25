import { Flex } from '@chakra-ui/react'
import { FC, useMemo } from 'react'
import { UserInfo } from '../../../../../../../shared/user/domain/user-info'
import { AbsenceFilters } from '../../../../domain/absence-filters'
import { OrganizationsCombo } from '../../../../../activity/ui/components/activity-form/components/combos/organizations-combo'
import { ProjectsCombo } from '../../../../../activity/ui/components/activity-form/components/combos/projects-combo'
import { useForm, useWatch } from 'react-hook-form'
import { UserFilter } from './user-filter/user-filter'
import { AvailabilityTableFiltersSchema } from './availability-table-filters.schema'

interface Props {
  onChange: (params: Partial<AbsenceFilters>) => void
}

export const AvailabilityTableFilters: FC<Props> = ({ onChange }) => {
  const { control } = useForm<AvailabilityTableFiltersSchema>()
  const [organization] = useWatch({
    control,
    name: ['organization']
  })

  const projectDisabled = useMemo(() => organization === undefined, [organization])

  const handleChange = (params: Partial<AbsenceFilters>) => onChange(params)

  return (
    <Flex flexDirection={'row'} alignItems={'center'} gap={3}>
      <OrganizationsCombo
        control={control}
        name={'organization'}
        organizationFilters={{ types: ['CLIENT'], imputable: true }}
        onChange={(item) => {
          handleChange({ organizationId: item?.id })
        }}
      />
      <ProjectsCombo
        control={control}
        organization={organization}
        name={'organizationId'}
        onChange={(item) => {
          handleChange({ projectId: item?.id })
        }}
        isDisabled={projectDisabled}
      />
      <UserFilter
        onChange={(userInfo?: UserInfo) => handleChange({ userId: userInfo?.id })}
      ></UserFilter>
    </Flex>
  )
}
