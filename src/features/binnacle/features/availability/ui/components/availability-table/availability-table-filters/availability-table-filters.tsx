import { Flex } from '@chakra-ui/react'
import { FC, useMemo } from 'react'
import { UserInfo } from '../../../../../../../shared/user/domain/user-info'
import { AbsenceFilters } from '../../../../domain/absence-filters'
import { OrganizationsCombo } from '../../../../../activity/ui/components/activity-form/components/combos/organizations-combo'
import { ProjectsCombo } from '../../../../../activity/ui/components/activity-form/components/combos/projects-combo'
import { useForm, useWatch } from 'react-hook-form'
import { UserFilter } from './user-filter/user-filter'
import { AvailabilityTableFiltersSchema } from './availability-table-filters.schema'
import { Project } from '../../../../../../../shared/project/domain/project'
import { Organization } from '../../../../../organization/domain/organization'
import { useIsMobile } from '../../../../../../../../shared/hooks/use-is-mobile'

interface Props {
  onChange: (params: Partial<AbsenceFilters>) => void
}

export const AvailabilityTableFilters: FC<Props> = ({ onChange }) => {
  const { control } = useForm<AvailabilityTableFiltersSchema>()
  const [organization] = useWatch({
    control,
    name: ['organization']
  })
  const isMobile = useIsMobile()

  const projectDisabled = useMemo(() => organization === undefined, [organization])

  const handleChange = (params: Partial<AbsenceFilters>) => onChange(params)

  return (
    <Flex
      flexDirection={isMobile ? 'column' : 'row'}
      width={isMobile ? '100%' : 'auto'}
      alignItems={'center'}
      gap={3}
    >
      <OrganizationsCombo
        control={control}
        name={'organization'}
        organizationFilters={{ types: ['CLIENT'] }}
        onChange={(organization: Organization) => {
          handleChange({ organizationIds: organization ? [organization?.id] : undefined })
        }}
      />
      <ProjectsCombo
        control={control}
        organization={organization}
        name={'organizationId'}
        onChange={(project: Project) => {
          handleChange({ projectIds: project ? [project?.id] : undefined })
        }}
        isDisabled={projectDisabled}
      />
      <UserFilter
        onChange={(userInfo: UserInfo) =>
          handleChange({ userIds: userInfo ? [userInfo?.id] : undefined })
        }
      ></UserFilter>
    </Flex>
  )
}
