import { Stack } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import { OrganizationsCombo } from 'modules/binnacle/components/ActivityForm/components/Combos/OrganizationsCombo'
import { ProjectsCombo } from './ProjectsCombo'
import { ProjectRolesCombo } from './ProjectRolesCombo'

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
      setValue('role', undefined)

      clearErrors(['project', 'role'])
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
      setValue('role', undefined)
      clearErrors('role')
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
      <ProjectRolesCombo control={control} isDisabled={roleDisabled} onChange={() => {}} />
    </Stack>
  )
}
