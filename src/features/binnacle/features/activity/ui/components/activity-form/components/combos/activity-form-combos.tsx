import { Stack } from '@chakra-ui/react'
import { FC, useEffect, useMemo } from 'react'
import { Control, useController, useWatch } from 'react-hook-form'
import { OrganizationsCombo } from './organizations-combo'
import { ProjectRolesCombo } from './project-roles-combo'
import { ProjectsCombo } from './projects-combo'

type CombosProps = {
  control: Control<any>
}
export const ActivityFormCombos: FC<CombosProps> = ({ control }) => {
  const [project, organization] = useWatch({
    control,
    name: ['project', 'organization']
  })

  const projectDisabled = useMemo(() => organization === undefined, [organization])
  const projectRoleDisabled = useMemo(() => project === undefined, [project])

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

  useEffect(onOrganizationChange, [organization])
  useEffect(onProjectChange, [project])

  return (
    <Stack direction={['column', 'row']} spacing={4}>
      <OrganizationsCombo control={control} />
      <ProjectsCombo control={control} isDisabled={projectDisabled} organization={organization} />
      <ProjectRolesCombo control={control} isDisabled={projectRoleDisabled} project={project} />
    </Stack>
  )
}
