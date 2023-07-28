import { Organization } from '../../features/binnacle/features/organization/domain/organization'

export class OrganizationMother {
  static organizations(): Organization[] {
    return [this.organization(), this.newOrganization()]
  }

  static organization(): Organization {
    return {
      id: 1,
      name: 'Test organization'
    }
  }

  static newOrganization(): Organization {
    return {
      id: 2,
      name: 'New Test organization'
    }
  }
}
