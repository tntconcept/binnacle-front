import { SearchProjectRolesResult } from '../../../search/domain/search-project-roles-result'
import { singleton } from 'tsyringe'
import { SubcontractedActivityWithProjectRoleId } from '../subcontracted-activity-with-project-role-id'
import { SubcontractedActivity } from '../subcontracted-activity'

@singleton()
export class SubcontractedActivitiesWithRoleInformation {
  addRoleInformationToActivities(
    subcontractedActivitiesWithProjectRoleId: SubcontractedActivityWithProjectRoleId[],
    searchProjectRolesResult: SearchProjectRolesResult
  ): SubcontractedActivity[] {
    return subcontractedActivitiesWithProjectRoleId
      .map((subcontractedActivityProjectRoleId) => {
        const { projectRoleId, ...subcontractedActivityDetails } =
          subcontractedActivityProjectRoleId

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
          ...subcontractedActivityDetails,
          organization,
          project,
          projectRole
        } as SubcontractedActivity
      })
      .filter((x) => x !== undefined) as SubcontractedActivity[]
  }
}
