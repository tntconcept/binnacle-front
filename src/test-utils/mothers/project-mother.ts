import { LiteProjectWithOrganizationId } from 'modules/binnacle/data-access/interfaces/lite-project-with-organization-id'
import { Project } from 'modules/binnacle/data-access/interfaces/project.interface'
import { OrganizationMother } from './organization-mother'

export class ProjectMother {
  static projects(): Project[] {
    return [this.notBillableProject(), this.billableProject()]
  }

  static liteProjects(): LiteProjectWithOrganizationId[] {
    return [this.notBillableLiteProject(), this.billableLiteProject()]
  }

  static notBillableProject(): Project {
    return {
      id: 1,
      name: 'No billable project',
      billable: false,
      open: true
    }
  }

  static notBillableLiteProject(): LiteProjectWithOrganizationId {
    const { id, name } = this.notBillableProject()

    return {
      id,
      name,
      organizationId: OrganizationMother.organization().id
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

  static billableLiteProject(): LiteProjectWithOrganizationId {
    const { id, name } = this.billableProject()

    return {
      id,
      name,
      organizationId: OrganizationMother.organization().id
    }
  }
}
