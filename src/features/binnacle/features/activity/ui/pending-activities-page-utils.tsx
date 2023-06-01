import { TimeUnits } from '../../../../../shared/types/time-unit'
import chrono, { getHumanizedDuration } from '../../../../../shared/utils/chrono'
import { getDurationByMinutes } from '../utils/getDuration'
import { PaperClipIcon } from '@heroicons/react/outline'
import React from 'react'
import { Activity } from '../domain/activity'

export const adaptActivitiesToTable = (activities: Activity[]) => {
  return activities?.map((activity, key) => {
    return {
      key,
      id: activity.id,
      employee: activity.userName,
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
      attachment: activity.hasEvidences && <PaperClipIcon width={'20px'} />,
      action: activity
    }
  })
}
