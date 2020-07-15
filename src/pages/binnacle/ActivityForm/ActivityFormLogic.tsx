import React, {
  // @ts-ignore
  unstable_useTransition as useTransition,
  useMemo,
  useState
} from 'react'
import { IActivity } from 'api/interfaces/IActivity'
import {
  createActivityFormSchema,
  createActivityOperation,
  getInitialValues,
  updateActivityOperation
} from 'pages/binnacle/ActivityForm/utils'
import { Formik, FormikProps } from 'formik'
import { differenceInMinutes, isAfter, isEqual, parse } from 'date-fns'
import { createActivity, updateActivity } from 'api/ActivitiesAPI'
import { SUSPENSE_CONFIG } from 'utils/constants'
import { useShowErrorNotification } from 'features/Notifications'
import { useBinnacleResources } from 'features/BinnacleResourcesProvider'
import useRecentRole from 'pages/binnacle/ActivityForm/useRecentRole'
import { useAutoFillHours } from 'pages/binnacle/ActivityForm/useAutoFillHours'
import { useSettings } from 'common/components/SettingsContext'
import * as yup from 'yup'
import i18n from 'i18n'
import { IProject } from 'api/interfaces/IProject'
import { IOrganization } from 'api/interfaces/IOrganization'
import { IProjectRole } from 'api/interfaces/IProjectRole'
import { IRecentRole } from 'api/interfaces/IRecentRole'

interface Props {
  date: Date
  activity?: IActivity
  lastEndTime?: Date
  onAfterSubmit: () => void
  children: (
    formik: FormikProps<ActivityFormValues>,
    utils: FormData
  ) => React.ReactNode
}

type FormData = {
  isPending: boolean
  showDurationInput: boolean
  recentRoleExists: IRecentRole | undefined
  showRecentRoles: boolean
  setShowRecentRoles: (state: boolean) => void
  imageBase64: string | null
  setImageBase64: (value: string | null) => void
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
  const [showRecentRoles, setShowRecentRoles] = useState<boolean>(
    recentRoleExists !== undefined
  )
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [{ autofillHours, hoursInterval, showDurationInput }] = useSettings()
  const { startTime, endTime } = useAutoFillHours(
    autofillHours,
    hoursInterval,
    props.lastEndTime
  )

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
      showErrorNotification(e)
    }
  }

  const activityFormSchema = useMemo(
    () => createActivityFormSchema(showRecentRoles),
    [showRecentRoles]
  )

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
          setImageBase64
        })
      }
    </Formik>
  )
}
