import { TimeUnits } from '../../../../../shared/types/time-unit'
import { chrono, getHumanizedDuration } from '../../../../../shared/utils/chrono'
import { getDurationByMinutes } from '../utils/get-duration'
import { PaperClipIcon } from '@heroicons/react/24/outline'
import { Activity } from '../domain/activity'

export interface AdaptedActivity {
  key: number
  id: number
  employeeName: string | undefined
  dates: string
  duration: string | number
  organization: string
  project: string
  role: string
  attachment: false | JSX.Element
  approvalState: string
  approvedByUserName?: string
  approvalDate?: string
  action: Activity
}

export const adaptActivitiesToTable = (activities: Activity[]): AdaptedActivity[] => {
  return activities?.map((activity, key) => ({
    key,
    id: activity.id,
    employeeName: activity.userName,
    dates:
      activity.interval.timeUnit === TimeUnits.MINUTES
        ? `${chrono(activity.interval.start).format(chrono.DATE_FORMAT)} | ${chrono(
            activity.interval.start
          ).format('HH:mm')} - ${chrono(activity.interval.end).format('HH:mm')}`
        : `${chrono(activity.interval.start).format(chrono.DATE_FORMAT)} - ${chrono(
            activity.interval.end
          ).format(chrono.DATE_FORMAT)}`,
    duration:
      activity.interval.timeUnit === TimeUnits.MINUTES
        ? getDurationByMinutes(activity.interval.duration)
        : getHumanizedDuration({
            duration: activity.interval.duration,
            abbreviation: true,
            timeUnit: activity.interval.timeUnit
          }),
    organization: activity.organization.name,
    project: activity.project.name,
    role: activity.projectRole.name,
    attachment: activity.hasEvidences && <PaperClipIcon key={'icon' + key} width={'20px'} />,
    action: activity,
    approvalDate: activity.approval.approvalDate
      ? chrono(activity.approval.approvalDate).format(chrono.DATETIME_FORMAT)
      : undefined,
    approvedByUserName: activity.approval.approvedByUserName,
    approvalState: activity.approval.state
  }))
}
