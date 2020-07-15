import {
  addMinutes,
  differenceInMinutes,
  format,
  isAfter,
  isEqual,
  parse
} from 'date-fns'
import { IActivity } from 'api/interfaces/IActivity'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import { ActivityFormValues } from 'pages/binnacle/ActivityForm/ActivityFormLogic'
import { createActivity, updateActivity } from 'api/ActivitiesAPI'
import * as yup from 'yup'
import i18n from 'i18n'
import { IOrganization } from 'api/interfaces/IOrganization'
import { IProject } from 'api/interfaces/IProject'
import { IProjectRole } from 'api/interfaces/IProjectRole'

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
        startTime: format(activity.startDate, 'HH:mm'),
        endTime: format(addMinutes(activity.startDate, activity.duration), 'HH:mm'),
        recentRole: recentRoleExists,
        billable: activity.billable,
        description: activity.description
      }
    }

    return {
      startTime: period!.startTime,
      endTime: period!.endTime,
      recentRole: recentRoleExists,
      billable: recentRoleExists?.projectBillable ?? false,
      description: ''
    }
  } else {
    if (activity) {
      return {
        startTime: format(activity.startDate, 'HH:mm'),
        endTime: format(addMinutes(activity.startDate, activity.duration), 'HH:mm'),
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
  const duration = differenceInMinutes(endTime, startDate)

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
  const duration = differenceInMinutes(endTime, startDate)

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
          const currentDate = new Date()
          const startDate = parse(startTime, 'HH:mm', currentDate)
          const endDate = parse(value, 'HH:mm', currentDate)
          return isAfter(endDate, startDate) || isEqual(endDate, startDate)
        })
        .defined(),
      billable: yup.boolean().required(i18n.t('form_errors.field_required')),
      description: yup
        .string()
        .required(i18n.t('form_errors.field_required'))
        .max(
          2048,
          (message) =>
            `${i18n.t('form_errors.max_length')} ${message.value.length} / ${
              message.max
            }`
        )
        .defined(),
      ...recentRoleSchema,
      ...entitiesSchema
    })
    .defined()

  return formSchema
}
