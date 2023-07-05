import { Badge } from '@chakra-ui/react'
import { PaperClipIcon } from '@heroicons/react/outline'
import { t } from 'i18next'
import { TimeUnits } from 'shared/types/time-unit'
import { chrono, getHumanizedDuration } from 'shared/utils/chrono'
import { Activity } from '../../../domain/activity'
import { getDurationByMinutes } from '../../../utils/get-duration'
import { ReactNode } from 'react'

export interface AdaptedActivity {
  key: number
  id: number
  dates: string
  duration: string | number
  organization: string
  project: string
  role: string
  approvalState: string | ReactNode
  attachment: false | JSX.Element
  action: Activity
}

export const activitiesListAdapter = (activities: Activity[]): AdaptedActivity[] => {
  const activitiesClone = activities.slice()
  activitiesClone.sort((a, b) => (chrono(a.interval.start).isAfter(b.interval.start) ? -1 : 1))

  return activitiesClone.map((activity, key) => {
    return {
      key,
      id: activity.id,
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
      approvalState: (function () {
        if (activity.approvalState === 'NA') {
          return '-'
        }
        if (activity.approvalState === 'PENDING') {
          return (
            <Badge borderRadius="md" px="9px" py="5px" colorScheme="orange">
              {t('activity.pending_state')}
            </Badge>
          )
        }
        if (activity.approvalState === 'ACCEPTED') {
          return (
            <Badge borderRadius="md" px="9px" py="5px" colorScheme="green">
              {t('activity.accepted_state')}
            </Badge>
          )
        }
      })(),
      attachment: activity.hasEvidences && <PaperClipIcon key={'icon' + key} width={'20px'} />,
      action: activity
    }
  })
}
