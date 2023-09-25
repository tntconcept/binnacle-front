import { Flex } from '@chakra-ui/react'
import { FC } from 'react'
import { UserInfo } from '../../../../../../../shared/user/domain/user-info'
import { AbsenceFilters } from '../../../../domain/absence-filters'
import { OrganizationsCombo } from '../../../../../activity/ui/components/activity-form/components/combos/organizations-combo'
import { ProjectsCombo } from '../../../../../activity/ui/components/activity-form/components/combos/projects-combo'
import { useForm } from 'react-hook-form'
import { UserFilter } from './user-filter/user-filter'

interface Props {
  onChange: (params: Partial<AbsenceFilters>) => void
}

export const AvailabilityTableFilters: FC<Props> = ({ onChange }) => {
  const { control } = useForm()
  const handleChange = (params: Partial<AbsenceFilters>) => onChange(params)

  return (
    <Flex flexDirection={'row'} alignItems={'center'} gap={3}>
      <OrganizationsCombo
        control={control}
        organizationFilters={{ types: ['CLIENT'], imputable: true }}
      />
      <ProjectsCombo control={control} isDisabled={false} />
      <UserFilter
        onChange={(userInfo?: UserInfo) => handleChange({ userId: userInfo?.id })}
      ></UserFilter>
    </Flex>
  )
}
