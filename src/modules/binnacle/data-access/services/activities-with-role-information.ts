import { ActivityWithProjectRoleId } from '../interfaces/activity-with-project-role-id.interface'
import { Activity } from '../interfaces/activity.interface'
import { SearchRolesResponse } from '../interfaces/search-roles-response.interface'

export class ActivitiesWithRoleInformation {
  static addRoleInformationToActivities(
    activitiesWithProjectRoleId: ActivityWithProjectRoleId[],
    searchRolesResponse: SearchRolesResponse
  ): Activity[] {
    //TODO
    //@ts-ignore
    const activities: Activity[] = activitiesWithProjectRoleId
      .map((activityProjectRoleId) => {
        const { projectRoleId, ...activityDetails } = activityProjectRoleId

        const projectRole = searchRolesResponse.projectRoles.find((p) => p.id === projectRoleId)
        if (!projectRole) return

        const project = searchRolesResponse.projects.find((p) => p.id === projectRole.projectId)
        if (!project) return

        const organization = searchRolesResponse.organizations.find(
          (o) => o.id === project!.organizationId
        )
        if (!organization) return

        return {
          ...activityDetails,
          organization,
          project,
          projectRole
        }
      })
      .filter((x) => x !== undefined)

    return activities
  }
}
