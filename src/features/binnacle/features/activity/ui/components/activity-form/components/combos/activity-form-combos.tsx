import { Stack } from '@chakra-ui/react'
import { forwardRef, useEffect, useMemo } from 'react'
import { Control, useController, useWatch } from 'react-hook-form'
import { OrganizationsCombo } from './organizations-combo'
import { ProjectRolesCombo } from './project-roles-combo'
import { ProjectsCombo } from './projects-combo'
import { ActivityFormSchema } from '../../activity-form.schema'

interface Props {
  control: Control<ActivityFormSchema>
  isReadOnly?: boolean
}

export const ActivityFormCombos = forwardRef<HTMLInputElement, Props>(
  ({ control, isReadOnly }, ref) => {
    const [project, organization] = useWatch({
      control,
      name: ['project', 'organization']
    })

    const projectDisabled = useMemo(
      () => organization === undefined || isReadOnly === true,
      [organization, isReadOnly]
    )
    const projectRoleDisabled = useMemo(
      () => project === undefined || isReadOnly === true,
      [project, isReadOnly]
    )

    const { field: organizationField } = useController({
      name: 'organization',
      control
    })

    const { field: projectField } = useController({
      name: 'project',
      control
    })

    const { field: projectRoleField } = useController({
      name: 'projectRole',
      control
    })

    const projectBelongsToOrganization =
      organizationField.value?.id === projectField.value?.organizationId
    const projectRoleBelongsToProject = projectField.value?.id === projectRoleField.value?.projectId

    const onOrganizationChange = () => {
      if (!projectBelongsToOrganization && !projectRoleBelongsToProject) {
        projectField.onChange(undefined)
        projectRoleField.onChange(undefined)
      }
    }

    const onProjectChange = () => {
      if (!projectRoleBelongsToProject) {
        projectRoleField.onChange(undefined)
      }
    }

    useEffect(onOrganizationChange, [organization])
    useEffect(onProjectChange, [project])

    return (
      <Stack direction={['column', 'row']} spacing={4}>
        <OrganizationsCombo ref={ref} control={control} isReadOnly={isReadOnly} />
        <ProjectsCombo control={control} isDisabled={projectDisabled} organization={organization} />
        <ProjectRolesCombo control={control} isDisabled={projectRoleDisabled} project={project} />
      </Stack>
    )
  }
)

ActivityFormCombos.displayName = 'ActivityFormCombos'
