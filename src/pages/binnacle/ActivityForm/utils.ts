import { IActivity } from 'core/api/interfaces'
import { IRecentRole } from 'core/api/interfaces'
import { ActivityFormValues } from 'pages/binnacle/ActivityForm/ActivityFormLogic'
import { createActivity, updateActivity } from 'core/api/activities'
import * as yup from 'yup'
import i18n from 'core/i18n/i18n'
import { IOrganization } from 'core/api/interfaces'
import { IProject } from 'core/api/interfaces'
import { IProjectRole } from 'core/api/interfaces'
import chrono, { parse, areIntervalsOverlapping } from 'core/services/Chrono'

export const openImageInTab = (data: any) => {
  const newImage = new Image()
  newImage.src = 'data:image/jpeg;base64,' + data
  // newImage.setAttribute("style", "-webkit-user-select: none;margin: auto;cursor: zoom-in;")

  const newWin = window.open('')
  if (newWin) {
    // newWin.document.write('<head><title>your title</title></head>')
    newWin.document.write(newImage.outerHTML)
    newWin.document.close()
  }
}

export const getInitialValues = (
  activity?: IActivity,
  recentRoleExists?: IRecentRole,
  period?: {
    startTime: string
    endTime: string
  }
): ActivityFormValues => {
  if (recentRoleExists) {
    if (activity) {
      return {
        startTime: chrono(activity.startDate).format(chrono.TIME_FORMAT),
        endTime: chrono(activity.startDate)
          .plus(activity.duration, 'minute')
          .format(chrono.TIME_FORMAT),
        recentRole: recentRoleExists,
        billable: activity.billable,
        description: activity.description
      }
    }

    return {
      startTime: period!.startTime,
      endTime: period!.endTime,
      recentRole: recentRoleExists,
      billable: recentRoleExists.projectBillable,
      description: ''
    }
  } else {
    if (activity) {
      return {
        startTime: chrono(activity.startDate).format(chrono.TIME_FORMAT),
        endTime: chrono(activity.startDate)
          .plus(activity.duration, 'minute')
          .format(chrono.TIME_FORMAT),
        organization: activity.organization,
        project: activity.project,
        role: activity.projectRole,
        billable: activity.billable,
        description: activity.description
      }
    }

    return {
      startTime: period!.startTime,
      endTime: period!.endTime,
      organization: undefined,
      project: undefined,
      role: undefined,
      billable: false,
      description: ''
    }
  }
}

export async function createActivityOperation(
  date: Date,
  values: ActivityFormValues,
  projectRoleId: number,
  imageBase64: string | null
) {
  const startDate = parse(values.startTime, 'HH:mm', date)
  const endTime = parse(values.endTime, 'HH:mm', date)

  const duration = chrono(startDate).diff(endTime, 'minute')

  await createActivity({
    startDate: startDate,
    billable: values.billable,
    description: values.description,
    duration: duration,
    projectRoleId: projectRoleId,
    hasImage: imageBase64 !== null,
    imageFile: imageBase64 !== null ? imageBase64 : undefined
  })
}

export async function updateActivityOperation(
  date: Date,
  activityId: number,
  values: ActivityFormValues,
  projectRoleId: number,
  imageBase64: string | null
) {
  const startDate = parse(values.startTime, 'HH:mm', date)
  const endTime = parse(values.endTime, 'HH:mm', date)
  const duration = chrono(startDate).diff(endTime, 'minute')

  await updateActivity({
    startDate: startDate,
    billable: values.billable,
    description: values.description,
    duration: duration,
    projectRoleId: projectRoleId,
    id: activityId,
    hasImage: imageBase64 !== null,
    imageFile: imageBase64 !== null ? imageBase64 : undefined
  })
}

// investigate other schema hierarchy based on showRecentRoles field https://github.com/jquense/yup/issues/225
export function createActivityFormSchema(showRecentRoles: boolean) {
  const recentRoleSchema = showRecentRoles && {
    recentRole: yup
      .object<IRecentRole>()
      .required(i18n.t('form_errors.field_required'))
      .defined()
  }

  const entitiesSchema = !showRecentRoles && {
    organization: yup
      .object<IOrganization>()
      .required(i18n.t('form_errors.select_an_option'))
      .defined(),
    project: yup
      .object<IProject>()
      .required(i18n.t('form_errors.select_an_option'))
      .defined(),
    role: yup
      .object<IProjectRole>()
      .required(i18n.t('form_errors.select_an_option'))
      .defined()
  }

  const formSchema: yup.ObjectSchema<ActivityFormValues> = yup
    .object({
      startTime: yup
        .string()
        .required(i18n.t('form_errors.field_required'))
        .defined(),
      endTime: yup
        .string()
        .required(i18n.t('form_errors.field_required'))
        .test('is-greater', i18n.t('form_errors.end_time_greater'), function(value) {
          const { startTime } = this.parent
          const currentDate = chrono.now()
          const startDate = parse(startTime, 'HH:mm', currentDate)
          const endDate = parse(value!, 'HH:mm', currentDate)

          return chrono(endDate).isAfter(startDate) || chrono(endDate).isSame(startDate)
        })
        .defined(),
      billable: yup.boolean().required(i18n.t('form_errors.field_required')),
      description: yup
        .string()
        .required(i18n.t('form_errors.field_required'))
        .max(
          2048,
          (message) =>
            `${i18n.t('form_errors.max_length')} ${message.value.length} / ${message.max}`
        )
        .defined(),
      ...recentRoleSchema,
      ...entitiesSchema
    })
    .defined()

  return formSchema
}

export function isTimeOverlappingWithPreviousActivities(
  startTime: string,
  endTime: string,
  date: Date,
  timeIntervals: Interval[]
) {
  let errorMessage

  const start = parse(startTime, 'HH:mm', date)
  const end = parse(endTime, 'HH:mm', date)

  try {
    const activityInterval = { start, end }

    const isOverlapping = timeIntervals.some((interval) =>
      areIntervalsOverlapping(interval, activityInterval)
    )

    if (isOverlapping) {
      errorMessage = i18n.t('form_errors.activity_hours_overlap')
    }
  } catch (e) {}

  return errorMessage
}
