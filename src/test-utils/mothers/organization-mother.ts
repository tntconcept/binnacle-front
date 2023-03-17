import { Organization } from 'modules/binnacle/data-access/interfaces/organization.interface'

export class OrganizationMother {
  static organizations(): Organization[] {
    return [this.organization()]
  }

  static organization(): Organization {
    return {
      id: 1,
      name: 'Test organization'
    }
  }
}
