import { SubcontractedActivityWithProjectRoleId } from '../domain/subcontracted-activity-with-project-role-id'

export class SubcontractedActivityWithProjectRoleIdMapper {
  static toDomain(
    dto: SubcontractedActivityWithProjectRoleId
  ): SubcontractedActivityWithProjectRoleId {
    return {
      ...dto
    }
  }
}
