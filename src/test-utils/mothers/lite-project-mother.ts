import { LiteProject } from '../../features/binnacle/features/project/domain/lite-project'
import { LiteProjectWithOrganizationId } from '../../features/binnacle/features/search/domain/lite-project-with-organization-id'
import { OrganizationMother } from './organization-mother'
import { ProjectMother } from '../../features/shared/project/domain/tests/project-mother'
import { Project } from '../../features/shared/project/domain/project'

export class LiteProjectMother {
  static projects(): Project[] {
    return [ProjectMother.notBillableProject(), ProjectMother.billableProject()]
  }

  static liteProjectsWithOrganizationId(): LiteProjectWithOrganizationId[] {
    return [
      this.notBillableLiteProjectWithOrganizationId(),
      this.billableLiteProjectWithOrganizationId()
    ]
  }

  static notBillableLiteProjectWithOrganizationId(): LiteProjectWithOrganizationId {
    const { id, name } = ProjectMother.notBillableProject()

    return {
      id,
      name,
      billable: false,
      organizationId: OrganizationMother.organization().id
    }
  }

  static notBillableLiteProject(): LiteProject {
    const { id, name, billable } = ProjectMother.notBillableProject()

    return {
      id,
      name,
      billable
    }
  }

  static billableLiteProject(): LiteProject {
    const { id, name, billable } = ProjectMother.billableProject()

    return {
      id,
      name,
      billable
    }
  }

  static billableLiteProjectWithOrganizationId(): LiteProjectWithOrganizationId {
    const { id, name } = ProjectMother.billableProject()

    return {
      billable: false,
      id,
      name,
      organizationId: OrganizationMother.organization().id
    }
  }
}
