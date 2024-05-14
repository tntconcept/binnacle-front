import { LiteProject } from '../../features/binnacle/features/project/domain/lite-project'
import { LiteProjectWithOrganizationId } from '../../features/binnacle/features/search/domain/lite-project-with-organization-id'
import { OrganizationMother } from './organization-mother'
import { Project } from '../../features/shared/project/domain/project'
import { ProjectMother } from './project-mother'

export class LiteProjectMother {
  static projects(): Project[] {
    return [
      ProjectMother.notBillableProject(),
      ProjectMother.billableProject(),
      ProjectMother.projectA(),
      ProjectMother.projectB()
    ]
  }

  static liteProjectsWithOrganizationId(): LiteProjectWithOrganizationId[] {
    return [
      this.notBillableLiteProjectWithOrganizationId(),
      this.billableLiteProjectWithOrganizationId(),
      this.projectAWithOrganizationId(),
      this.projectBWithOrganizationId()
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

  static projectAWithOrganizationId(): LiteProjectWithOrganizationId {
    const { id, name } = ProjectMother.projectA()

    return {
      billable: false,
      id,
      name,
      organizationId: OrganizationMother.organization().id
    }
  }

  static projectBWithOrganizationId(): LiteProjectWithOrganizationId {
    const { id, name } = ProjectMother.projectB()

    return {
      billable: false,
      id,
      name,
      organizationId: OrganizationMother.organization().id
    }
  }
}
