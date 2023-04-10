import { SearchProjectRolesResult } from 'features/binnacle/features/search/domain/search-project-roles-result'
import { singleton } from 'tsyringe'
import { Activity } from '../activity'
import { ActivityWithProjectRoleId } from '../activity-with-project-role-id'

@singleton()
export class ActivitiesWithRoleInformation {
  addRoleInformationToActivities(
    activitiesWithProjectRoleId: ActivityWithProjectRoleId[],
    searchProjectRolesResult: SearchProjectRolesResult
  ): Activity[] {
    const activities: Activity[] = activitiesWithProjectRoleId
      .map((activityProjectRoleId) => {
        const { projectRoleId, ...activityDetails } = activityProjectRoleId

        const projectRole = searchProjectRolesResult.projectRoles.find(
          (p) => p.id === projectRoleId
        )

        const project = searchProjectRolesResult.projects.find(
          (p) => p.id === projectRole?.projectId
        )

        const organization = searchProjectRolesResult.organizations.find(
          (o) => o.id === project?.organizationId
        )

        if (!organization) return

        return {
          ...activityDetails,
          organization,
          project,
          projectRole
        } as Activity
      })
      .filter((x) => x !== undefined) as Activity[]

    return activities
  }
}
