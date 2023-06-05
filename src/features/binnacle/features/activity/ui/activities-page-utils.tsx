import { TimeUnits } from '../../../../../shared/types/time-unit'
import chrono, { getHumanizedDuration } from '../../../../../shared/utils/chrono'
import { getDurationByMinutes } from '../utils/getDuration'
import { PaperClipIcon } from '@heroicons/react/outline'
import { Activity } from '../domain/activity'
import React from 'react'
import { Badge } from '@chakra-ui/react'

export interface AdaptedActivity {
  key: number
  id: number
  start_date: string
  end_date: string
  duration: string | number
  organization: string
  project: string
  role: string
  approvalState: string | React.ReactNode
  attachment: false | JSX.Element
  action: Activity
}

export const adaptActivitiesToTable = (activities: Activity[]): AdaptedActivity[] => {
  return activities?.map((activity, key) => {
    return {
      key,
      id: activity.id,
      start_date:
        activity.interval.timeUnit === TimeUnits.MINUTES
          ? `${chrono(activity.interval.start).format('yyyy-MM-dd')} | ${chrono(
              activity.interval.start
            ).format('HH:mm')}`
          : `${chrono(activity.interval.start).format('yyyy-MM-dd')}`,
      end_date:
        activity.interval.timeUnit === TimeUnits.MINUTES
          ? `${chrono(activity.interval.end).format('yyyy-MM-dd')} | ${chrono(
              activity.interval.end
            ).format('HH:mm')}`
          : `${chrono(activity.interval.end).format('yyyy-MM-dd')}`,
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
      approvalState: (function () {
        if (activity.approvalState === 'NA') {
          return '-'
        }
        if (activity.approvalState === 'PENDING') {
          return (
            <Badge borderRadius="md" px="9px" py="5px" colorScheme="orange">
              {activity.approvalState}
            </Badge>
          )
        }
        if (activity.approvalState === 'ACCEPTED') {
          return (
            <Badge borderRadius="md" px="9px" py="5px" colorScheme="green">
              {activity.approvalState}
            </Badge>
          )
        }
      })(),
      attachment: activity.hasEvidences && <PaperClipIcon key={'icon' + key} width={'20px'} />,
      action: activity
    }
  })
}
