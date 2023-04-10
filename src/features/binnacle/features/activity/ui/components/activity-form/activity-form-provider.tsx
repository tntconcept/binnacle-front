import { yupResolver } from '@hookform/resolvers/yup'
import { GetRecentProjectRolesQry } from 'features/binnacle/features/project-role/application/get-recent-project-roles-qry'
import { GetUserSettingsQry } from 'features/user/features/settings/application/get-user-settings-qry'
import type { FC, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { CreateActivityCmd } from '../../../application/create-activity-cmd'
import { UpdateActivityCmd } from '../../../application/update-activity-cmd'
import { Activity } from '../../../domain/activity'
import { ActivityFormSchema, ActivityFormValidationSchema } from './activity-form.schema'
import { GetAutofillHours } from './utils/get-autofill-hours'
import { GetInitialActivityFormValues } from './utils/get-initial-activity-form-values'

interface Props {
  date: Date
  activity?: Activity
  lastEndTime?: Date
  onAfterSubmit: () => void
}

export const ActivityFormProvider: FC<PropsWithChildren<Props>> = (props) => {
  const { date, activity, lastEndTime, onAfterSubmit, children } = props
  const { result: settings } = useExecuteUseCaseOnMount(GetUserSettingsQry)
  const { useCase: createActivityCmd } = useGetUseCase(CreateActivityCmd)
  const { useCase: updateActivityCmd } = useGetUseCase(UpdateActivityCmd)
  const { result: recentRoles } = useExecuteUseCaseOnMount(GetRecentProjectRolesQry)

  const initialFormValues = useMemo(() => {
    if (!settings) return

    const { getInitialFormValues } = new GetInitialActivityFormValues(
      activity,
      recentRoles || [],
      new GetAutofillHours(settings.autofillHours, settings.hoursInterval, lastEndTime)
    )

    return getInitialFormValues()
  }, [activity, date, lastEndTime, recentRoles, settings])

  const methods = useForm<ActivityFormSchema>({
    defaultValues: initialFormValues,
    resolver: yupResolver(ActivityFormValidationSchema),
    mode: 'onSubmit'
  })

  const onSubmit = async (data: any) => {
    try {
      if (activity?.id) {
        createActivityCmd.execute(data)
      } else {
        updateActivityCmd.execute(data)
      }
      onAfterSubmit()
    } catch (e) {}
  }

  return (
    // @ts-ignore
    <FormProvider {...methods} handleSubmit={methods.handleSubmit(onSubmit)}>
      {children}
    </FormProvider>
  )
}
