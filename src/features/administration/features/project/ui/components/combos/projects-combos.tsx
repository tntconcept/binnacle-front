import { Stack } from '@chakra-ui/react'
import { FC } from 'react'
import { OrganizationsCombo } from '../../../../../../binnacle/features/activity/ui/components/activity-form/components/combos/organizations-combo'
import { StatusCombo } from './status-combo'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  ProjectsFilterFormSchema,
  ProjectsFilterFormValidationSchema
} from '../projects-filter-form.schema'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

interface ProjectsFilterProps {
  onFiltersChange: SubmitHandler<ProjectsFilterFormSchema>
}

export const ProjectsFilterFormCombos: FC<ProjectsFilterProps> = (props) => {
  const { onFiltersChange } = props
  const { control, handleSubmit } = useForm<ProjectsFilterFormSchema>({
    resolver: yupResolver(ProjectsFilterFormValidationSchema),
    mode: 'onChange'
  })

  return (
    <Stack
      direction={['column', 'row']}
      spacing={4}
      maxWidth={'400px'}
      marginBottom={5}
      marginTop={10}
      as={'form'}
      onBlur={handleSubmit(onFiltersChange)}
    >
      <OrganizationsCombo control={control} isReadOnly={false} />
      <StatusCombo control={control} />
    </Stack>
  )
}
