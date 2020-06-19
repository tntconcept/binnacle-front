import { addMinutes, format } from 'date-fns'
import { IActivity } from 'api/interfaces/IActivity'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import { ActivityFormValues } from 'features/ActivityForm/ActivityForm'

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
