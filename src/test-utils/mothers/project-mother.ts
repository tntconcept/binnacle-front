import { LiteProject } from 'features/binnacle/features/project/domain/lite-project'
import { Project } from 'features/binnacle/features/project/domain/project'
import { LiteProjectWithOrganizationId } from 'features/binnacle/features/search/domain/lite-project-with-organization-id'
import { OrganizationMother } from './organization-mother'

export class ProjectMother {
  static projects(): Project[] {
    return [this.notBillableProject(), this.billableProject()]
  }

  static liteProjectsWithOrganizationId(): LiteProjectWithOrganizationId[] {
    return [
      this.notBillableLiteProjectWithOrganizationId(),
      this.billableLiteProjectWithOrganizationId()
    ]
  }

  static notBillableProject(): Project {
    return {
      id: 1,
      name: 'No billable project',
      billable: false,
      open: true
    }
  }

  static notBillableLiteProjectWithOrganizationId(): LiteProjectWithOrganizationId {
    const { id, name } = this.notBillableProject()

    return {
      id,
      name,
      billable: false,
      organizationId: OrganizationMother.organization().id
    }
  }

  static notBillableLiteProject(): LiteProject {
    const { id, name, billable } = this.notBillableProject()

    return {
      id,
      name,
      billable
    }
  }

  static billableProject(): Project {
    return {
      id: 2,
      name: 'Billable project',
      billable: true,
      open: true
    }
  }

  static billableLiteProject(): LiteProject {
    const { id, name, billable } = this.billableProject()

    return {
      id,
      name,
      billable
    }
  }

  static billableLiteProjectWithOrganizationId(): LiteProjectWithOrganizationId {
    const { id, name } = this.billableProject()

    return {
      billable: false,
      id,
      name,
      organizationId: OrganizationMother.organization().id
    }
  }
}
