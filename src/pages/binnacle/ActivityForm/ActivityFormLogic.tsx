// @ts-ignore
// prettier-ignore
import React, { unstable_useTransition as useTransition, useMemo, useState } from 'react'
import { IActivity } from 'api/interfaces/IActivity'
import {
  createActivityFormSchema,
  createActivityOperation,
  getInitialValues,
  updateActivityOperation
} from 'pages/binnacle/ActivityForm/utils'
import { Formik, FormikProps } from 'formik'
import { SUSPENSE_CONFIG } from 'utils/constants'
import { useShowErrorNotification } from 'core/features/Notifications/useShowErrorNotification'
import { useBinnacleResources } from 'core/features/BinnacleResourcesProvider'
import useRecentRole from 'pages/binnacle/ActivityForm/useRecentRole'
import { useAutoFillHours } from 'pages/binnacle/ActivityForm/useAutoFillHours'
import { IProject } from 'api/interfaces/IProject'
import { IOrganization } from 'api/interfaces/IOrganization'
import { IProjectRole } from 'api/interfaces/IProjectRole'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import { parseActivityErrorResponse } from 'api/ActivitiesAPI'
import { useSettings } from 'pages/settings/Settings.utils'

interface Props {
  date: Date
  activity?: IActivity
  lastEndTime?: Date
  onAfterSubmit: () => void
  children: (formik: FormikProps<ActivityFormValues>, utils: ActivityFormData) => React.ReactNode
}

export type ActivityFormData = {
  isPending: boolean
  showDurationInput: boolean
  recentRoleExists: IRecentRole | undefined
  showRecentRoles: boolean
  setShowRecentRoles: (state: boolean) => void
  imageBase64: string | null
  setImageBase64: (value: string | null) => void
  activity?: IActivity
}

export interface ActivityFormValues {
  startTime: string
  endTime: string
  organization?: IOrganization
  project?: IProject
  role?: IProjectRole
  recentRole?: IRecentRole
  billable: boolean
  description: string
}

export function ActivityFormLogic(props: Props) {
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const showErrorNotification = useShowErrorNotification()
  const { updateCalendarResources } = useBinnacleResources()
  const recentRoleExists = useRecentRole(props.date, props.activity?.projectRole.id)
  const [showRecentRoles, setShowRecentRoles] = useState<boolean>(recentRoleExists !== undefined)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const { autofillHours, hoursInterval, showDurationInput } = useSettings()
  const { startTime, endTime } = useAutoFillHours(autofillHours, hoursInterval, props.lastEndTime)

  const handleSubmit = async (values: ActivityFormValues) => {
    try {
      const projectRoleId = showRecentRoles ? values.recentRole!.id : values.role!.id

      if (props.activity) {
        await updateActivityOperation(
          props.date,
          props.activity.id,
          values,
          projectRoleId,
          imageBase64
        )
      } else {
        await createActivityOperation(props.date, values, projectRoleId, imageBase64)
      }

      startTransition(() => {
        props.onAfterSubmit()
        updateCalendarResources()
      })
    } catch (e) {
      const errorMessage = await parseActivityErrorResponse(e.response)
      showErrorNotification(e, errorMessage)
    }
  }

  const activityFormSchema = useMemo(() => createActivityFormSchema(showRecentRoles), [
    showRecentRoles
  ])

  const initialValues = useMemo(
    () =>
      getInitialValues(props.activity, recentRoleExists, {
        startTime,
        endTime
      }),
    [endTime, props.activity, recentRoleExists, startTime]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={activityFormSchema}
      onSubmit={handleSubmit}
    >
      {(formik) =>
        props.children(formik, {
          isPending,
          showDurationInput,
          recentRoleExists,
          showRecentRoles,
          setShowRecentRoles,
          imageBase64,
          setImageBase64,
          activity: props.activity
        })
      }
    </Formik>
  )
}
