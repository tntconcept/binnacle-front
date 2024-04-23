import { SubcontractedActivity } from '../../../domain/subcontracted-activity'

export interface AdaptedSubcontractedActivity {
  key: number
  id: number
  dates: string
  duration: string | number
  organization: string
  project: string
  role: string
  action: SubcontractedActivity
}

export const subcontractedActivitiesListAdapter = (
  activities: SubcontractedActivity[]
): AdaptedSubcontractedActivity[] => {
  const activitiesClone = activities.slice()

  return activitiesClone.map((activity, key) => {
    return {
      key,
      id: activity.id,
      dates: activity.month,
      duration: activity.duration / 60,
      organization: activity.organization.name,
      project: activity.project.name,
      role: activity.projectRole.name,
      action: activity
    }
  })
}
