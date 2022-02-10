import { yupResolver } from "@hookform/resolvers/yup";
import type { ActivityFormSchema } from "modules/binnacle/components/ActivityForm/ActivityForm.schema";
import { ActivityFormValidationSchema } from "modules/binnacle/components/ActivityForm/ActivityForm.schema";
import { SubmitActivityFormAction } from "modules/binnacle/data-access/actions/submit-activity-form-action";
import type { Activity } from "modules/binnacle/data-access/interfaces/activity.interface";
import type { FC } from "react";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useGlobalState } from "shared/arch/hooks/use-global-state";
import { SettingsState } from "shared/data-access/state/settings-state";
import { useAction } from "shared/arch/hooks/use-action";
import { observer } from "mobx-react";
import { getActivityHttpErrorMessage } from "modules/binnacle/components/ActivityForm/utils/get-activity-http-error-message";
import { GetInitialActivityFormValues } from "modules/binnacle/components/ActivityForm/utils/get-initial-activity-form-values";
import { GetRecentRole } from "modules/binnacle/components/ActivityForm/utils/get-recent-role";
import { BinnacleState } from "modules/binnacle/data-access/state/binnacle-state";
import { GetAutofillHours } from "modules/binnacle/components/ActivityForm/utils/get-autofill-hours";

interface Props {
  date: Date
  activity?: Activity
  lastEndTime?: Date
  onAfterSubmit: () => void
}

export const ActivityFormProvider: FC<Props> = observer((props) => {
  const { recentRoles, activities } = useGlobalState(BinnacleState)
  const { autofillHours, hoursInterval } = useGlobalState(SettingsState).settings

  const initialFormValues = useMemo(() => {
    const { getInitialFormValues } = new GetInitialActivityFormValues(
      props.activity,
      new GetRecentRole(props.date, props.activity?.projectRole.id, recentRoles, activities),
      new GetAutofillHours(autofillHours, hoursInterval, props.lastEndTime)
    )

    return getInitialFormValues()
  }, [
    activities,
    autofillHours,
    hoursInterval,
    props.activity,
    props.date,
    props.lastEndTime,
    recentRoles
  ])

  const methods = useForm<ActivityFormSchema>({
    defaultValues: initialFormValues,
    resolver: yupResolver(ActivityFormValidationSchema),
    mode: 'onSubmit'
  })

  const submitActivityForm = useAction(SubmitActivityFormAction, {
    showAlertError: getActivityHttpErrorMessage
  })

  const onSubmit = async (data: any) => {
    try {
      await submitActivityForm({
        activityId: props.activity?.id,
        activityDate: props.date,
        values: data
      })

      props.onAfterSubmit()
    } catch (e) {
      // no empty
    }
  }

  return (
    // @ts-ignore
    <FormProvider {...methods} handleSubmit={methods.handleSubmit(onSubmit)}>
      {props.children}
    </FormProvider>
  )
})
