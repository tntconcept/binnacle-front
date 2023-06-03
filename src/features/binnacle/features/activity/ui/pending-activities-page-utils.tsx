import { TimeUnits } from '../../../../../shared/types/time-unit'
import chrono, { getHumanizedDuration } from '../../../../../shared/utils/chrono'
import { getDurationByMinutes } from '../utils/getDuration'
import { PaperClipIcon } from '@heroicons/react/outline'
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
  status: Activity
  attachment: false | JSX.Element
  action: Activity
}

export const adaptActivitiesToTable = (activities: Activity[]): AdaptedActivity[] => {
  return activities?.map((activity, key) => {
    return {
      key,
      id: activity.id,
      employeeName: activity.userName,
      dates:
        activity.interval.timeUnit === TimeUnits.MINUTES
          ? `${chrono(activity.interval.start).format('yyyy-MM-dd')} | ${chrono(
              activity.interval.start
            ).format('HH:mm')} - ${chrono(activity.interval.end).format('HH:mm')}`
          : `${chrono(activity.interval.start).format('yyyy-MM-dd')} - ${chrono(
              activity.interval.end
            ).format('yyyy-MM-dd')}`,
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
      status: activity,
      attachment: activity.hasEvidences && <PaperClipIcon key={'icon' + key} width={'20px'} />,
      action: activity
    }
  })
}
