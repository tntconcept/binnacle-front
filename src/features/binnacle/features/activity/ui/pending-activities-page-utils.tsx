import { TimeUnits } from '../../../../../shared/types/time-unit'
import { chrono, getHumanizedDuration } from '../../../../../shared/utils/chrono'
import { getDurationByMinutes } from '../utils/get-duration'
import { Activity } from '../domain/activity'
import { EvidenceIcon } from './components/pending-activities/evidence-icon/evidence-icon'
import { ActivityApproval } from '../domain/activity-approval'
import { TextWithTooltip } from '../../../../../shared/components/text-with-tooltip/text-with-tooltip'

export interface AdaptedActivity {
  key: number
  id: number
  employeeName: string | undefined
  dates: string
  duration: string | number
  organization: string
  project: string
  role: JSX.Element
  attachment: false | JSX.Element
  approvalState: string
  approvalDate?: ActivityApproval
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
    userId: activity.userId,
    role: (
      <TextWithTooltip text={activity.projectRole.name} tooltipContent={activity.description} />
    ),
    attachment: activity.evidences && (
      <EvidenceIcon evidenceUuid={activity.evidences[0]} evidenceKey={key} />
    ),
    action: activity,
    approvalDate: activity.approval,
    approvalState: activity.approval.state
  }))
}
