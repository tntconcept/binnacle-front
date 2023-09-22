import { Stack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { FC, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { OrganizationsCombo } from '../../../../../../binnacle/features/activity/ui/components/activity-form/components/combos/organizations-combo'
import { Organization } from '../../../../../../binnacle/features/organization/domain/organization'
import { ProjectStatus } from '../../../domain/project-status'
import {
  ProjectsFilterFormSchema,
  ProjectsFilterFormValidationSchema
} from './projects-filter-form.schema'
import { StatusCombo } from './status-combo'
import { useIsMobile } from '../../../../../../../shared/hooks/use-is-mobile'
import { Status } from '../../../domain/status'

interface ProjectsFilterProps {
  onFiltersChange: (organization: Organization, status: ProjectStatus) => Promise<void>
}

export const ProjectsFilterFormCombos: FC<ProjectsFilterProps> = (props) => {
  const { onFiltersChange } = props
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { control, trigger } = useForm<ProjectsFilterFormSchema>({
    defaultValues: {
      status: {
        id: 1,
        value: true,
        name: t('projects.open') as Status
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
  }, [onFiltersChange, organization, status, trigger])

  return (
    <Stack
      direction={['column', 'row']}
      spacing={4}
      maxWidth={isMobile ? '100%' : '400px'}
      marginBottom={5}
      marginTop={4}
    >
      <OrganizationsCombo
        control={control}
        isReadOnly={false}
        organizationFilters={{ imputable: true }}
      />
      <StatusCombo control={control} />
    </Stack>
  )
}
