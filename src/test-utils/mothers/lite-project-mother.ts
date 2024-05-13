import { LiteProject } from '../../features/binnacle/features/project/domain/lite-project'
import { LiteProjectWithOrganizationId } from '../../features/binnacle/features/search/domain/lite-project-with-organization-id'
import { OrganizationMother } from './organization-mother'
import { Project } from '../../features/shared/project/domain/project'
import { ProjectMother } from './project-mother'
import { ProjectTypeMother } from './project-type-mother'

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
      projectBillingType: ProjectTypeMother.noBillableProjectType(),
      organizationId: OrganizationMother.organization().id
    }
  }

  static notBillableLiteProject(): LiteProject {
    const { id, name, projectBillingType } = ProjectMother.notBillableProject()

    return {
      id,
      name,
      projectBillingType
    }
  }

  static billableLiteProject(): LiteProject {
    const { id, name, projectBillingType } = ProjectMother.billableProject()

    return {
      id,
      name,
      projectBillingType
    }
  }

  static billableLiteProjectWithOrganizationId(): LiteProjectWithOrganizationId {
    const { id, name } = ProjectMother.billableProject()

    return {
      projectBillingType: ProjectTypeMother.closedPriceProjectType(),
      id,
      name,
      organizationId: OrganizationMother.organization().id
    }
  }
}
