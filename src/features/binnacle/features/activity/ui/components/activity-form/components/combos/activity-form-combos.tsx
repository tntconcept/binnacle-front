import { Stack } from '@chakra-ui/react'
import { forwardRef, useEffect, useMemo, useRef } from 'react'
import { Control, useController, useWatch } from 'react-hook-form'
import { Id } from '../../../../../../../../../shared/types/id'
import { ActivityFormSchema } from '../../activity-form.schema'
import { OrganizationsCombo } from './organizations-combo'
import { ProjectRolesCombo } from './project-roles-combo'
import { ProjectsCombo } from './projects-combo'

interface Props {
  control: Control<ActivityFormSchema>
  isReadOnly?: boolean
  userId?: Id
}

export const ActivityFormCombos = forwardRef<HTMLInputElement, Props>(
  ({ control, isReadOnly, userId }, organizationRef) => {
    const projectRef = useRef<HTMLInputElement>(null)
    const projectRoleRef = useRef<HTMLInputElement>(null)
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

    useEffect(() => {
      if (projectDisabled) return

      projectRef.current?.focus()
    }, [projectDisabled])

    useEffect(() => {
      if (projectRoleDisabled) return

      projectRoleRef.current?.focus()
    }, [projectRoleDisabled])

    return (
      <Stack direction={['column', 'row']} spacing={4}>
        <OrganizationsCombo
          ref={organizationRef}
          control={control}
          onChange={(item) => {
            if (item?.name !== organization?.name) onOrganizationChange()
          }}
          isReadOnly={isReadOnly}
        />
        <ProjectsCombo
          ref={projectRef}
          control={control}
          isDisabled={projectDisabled}
          onChange={(item) => {
            if (item?.name !== project?.name) onProjectChange()
          }}
          organization={organization}
        />
        <ProjectRolesCombo
          ref={projectRoleRef}
          control={control}
          userId={userId}
          isDisabled={projectRoleDisabled}
          project={project}
        />
      </Stack>
    )
  }
)

ActivityFormCombos.displayName = 'ActivityFormCombos'
