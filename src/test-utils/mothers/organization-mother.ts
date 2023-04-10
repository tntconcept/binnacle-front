import { Organization } from 'features/binnacle/features/organization/domain/organization'

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
