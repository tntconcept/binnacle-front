import { Stack } from '@chakra-ui/react'
import { forwardRef, useMemo } from 'react'
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

    const { field: projectField } = useController({
      name: 'project',
      control
    })

    const { field: projectRoleField } = useController({
      name: 'projectRole',
      control
    })

    const onOrganizationChange = () => {
      projectField.onChange()
      projectRoleField.onChange()
    }

    const onProjectChange = () => {
      projectRoleField.onChange()
    }

    return (
      <Stack direction={['column', 'row']} spacing={4}>
        <OrganizationsCombo
          ref={ref}
          control={control}
          onChange={(item) => {
            if (item?.name !== organization?.name) onOrganizationChange()
          }}
          isReadOnly={isReadOnly}
        />
        <ProjectsCombo
          control={control}
          isDisabled={projectDisabled}
          onChange={(item) => {
            if (item?.name !== project?.name) onProjectChange()
          }}
          organization={organization}
        />
        <ProjectRolesCombo control={control} isDisabled={projectRoleDisabled} project={project} />
      </Stack>
    )
  }
)

ActivityFormCombos.displayName = 'ActivityFormCombos'
