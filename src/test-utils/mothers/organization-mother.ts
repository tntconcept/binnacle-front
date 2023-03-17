import { Organization } from 'modules/binnacle/data-access/interfaces/organization.interface'

export class OrganizationMother {
  static organization(): Organization {
    return {
      id: 1,
      name: 'Test organization'
    }
  }
}
