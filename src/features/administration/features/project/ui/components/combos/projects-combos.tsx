import { Stack } from '@chakra-ui/react'
import { FC, useEffect } from 'react'
import { OrganizationsCombo } from '../../../../../../binnacle/features/activity/ui/components/activity-form/components/combos/organizations-combo'
import { StatusCombo } from './status-combo'
import { useForm, useWatch } from 'react-hook-form'
import {
  ProjectsFilterFormSchema,
  ProjectsFilterFormValidationSchema
} from './projects-filter-form.schema'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { useTranslation } from 'react-i18next'
import { Organization } from '../../../../../../binnacle/features/organization/domain/organization'
import { ProjectStatus } from '../../../domain/project-status'

interface ProjectsFilterProps {
  onFiltersChange: (organization: Organization, status: ProjectStatus) => Promise<void>
}

export const ProjectsFilterFormCombos: FC<ProjectsFilterProps> = (props) => {
  const { onFiltersChange } = props
  const { t } = useTranslation()
  const { control, trigger } = useForm<ProjectsFilterFormSchema>({
    defaultValues: {
      status: {
        id: 1,
        value: true,
        name: t('projects.open')
      }
    },
    resolver: yupResolver(ProjectsFilterFormValidationSchema),
    mode: 'onChange'
  })

  const [organization, status] = useWatch({
    control: control,
    name: ['organization', 'status']
  })

  useEffect(() => {
    organization && trigger(['organization', 'status'])
    organization && status && onFiltersChange(organization, status)
  }, [organization, status])

  return (
    <Stack
      direction={['column', 'row']}
      spacing={4}
      maxWidth={'400px'}
      marginBottom={5}
      marginTop={10}
      as={'form'}
    >
      <OrganizationsCombo control={control} isReadOnly={false} />
      <StatusCombo control={control} />
    </Stack>
  )
}
