import { AdaptedSubcontractedActivity } from './types/adapted-subcontracted-activity'
import { SubcontractedActivity } from '../../../domain/subcontracted-activity'

export const subcontractedActivitiesListAdapter = (
  activities: SubcontractedActivity[]
): AdaptedSubcontractedActivity[] => {
  return activities.map((activity) => {
    return {
      key: activity.id,
      id: activity.id,
      month: activity.month,
      duration: activity.duration + 'h',
      organization: activity.organization.name,
      project: activity.project.name,
      role: activity.projectRole.name,
      action: activity
    }
  })
}
