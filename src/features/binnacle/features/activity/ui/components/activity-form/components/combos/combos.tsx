import { Stack } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ActivityFormSchema } from '../../activity-form.schema'
import { OrganizationsCombo } from './organizations-combo'
import { ProjectRolesCombo } from './project-roles-combo'
import { ProjectsCombo } from './projects-combo'

export const Combos = () => {
  const { setValue, control, clearErrors, getValues } = useFormContext<ActivityFormSchema>()
  const [projectDisabled, setProjectDisabled] = useState(getValues().organization === undefined)
  const [roleDisabled, setRoleDisabled] = useState(getValues().project === undefined)

  const handleOrganizationSelect = useCallback(
    (organization) => {
      if (organization === undefined) {
        setProjectDisabled(true)
        setRoleDisabled(true)
      } else {
        setProjectDisabled(false)
      }

      setValue('project', undefined)
      setValue('projectRole', undefined)

      clearErrors(['project', 'projectRole'])
    },
    [setValue, clearErrors]
  )

  const handleProjectSelect = useCallback(
    (proj) => {
      if (proj) {
        setValue('billable', proj.billable)
        setRoleDisabled(false)
      } else {
        setRoleDisabled(true)
      }
      setValue('projectRole', undefined)
      clearErrors('projectRole')
    },
    [setValue, clearErrors]
  )

  return (
    <Stack direction={['column', 'row']} spacing={4}>
      <OrganizationsCombo control={control} onChange={handleOrganizationSelect} />
      <ProjectsCombo
        control={control}
        isDisabled={projectDisabled}
        onChange={handleProjectSelect}
      />
      <ProjectRolesCombo control={control} isDisabled={roleDisabled} />
    </Stack>
  )
}
