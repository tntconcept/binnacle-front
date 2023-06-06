import { Stack } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { OrganizationsCombo } from '../../../../../../binnacle/features/activity/ui/components/activity-form/components/combos/organizations-combo'
import { StatusCombo } from './status-combo'
import { useForm } from 'react-hook-form'
import {
  ProjectsFilterFormSchema,
  ProjectsFilterFormValidationSchema
} from '../projects-filter-form.schema'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Organization } from '../../../../../../binnacle/features/organization/domain/organization'
import { Status } from '../../../domain/status'

interface ProjectsFilterProps {
  onFiltersChange: (organization?: Organization, status?: Status) => void
}

export const ProjectsFilterFormCombos: FC<ProjectsFilterProps> = (props) => {
  const { onFiltersChange } = props
  const [organization, setOrganization] = useState<Organization>()
  const [status, setStatus] = useState<Status>()
  const { control } = useForm<ProjectsFilterFormSchema>({
    resolver: yupResolver(ProjectsFilterFormValidationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    onFiltersChange(organization, status)
  }, [onFiltersChange, organization, status])

  return (
    <Stack
      direction={['column', 'row']}
      spacing={4}
      maxWidth={'400px'}
      marginBottom={5}
      marginTop={10}
    >
      <OrganizationsCombo
        control={control}
        isReadOnly={false}
        onChange={(item) => setOrganization(item)}
      />
      <StatusCombo control={control} onChange={(item) => setStatus(item)} />
    </Stack>
  )
}
