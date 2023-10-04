import { Query, UseCaseKey } from '@archimedes/arch'
import { ORGANIZATION_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { Organization } from '../domain/organization'
import type { OrganizationRepository } from '../domain/organization-repository'
import { OrganizationFilters } from '../domain/organization-filters'

@UseCaseKey('GetOrganizationsQry')
@singleton()
export class GetOrganizationsQry extends Query<Organization[], OrganizationFilters> {
  constructor(
    @inject(ORGANIZATION_REPOSITORY) private organizationRepository: OrganizationRepository
  ) {
    super()
  }

  internalExecute(organizationFilters: OrganizationFilters): Promise<Organization[]> {
    return this.organizationRepository.getAll(organizationFilters)
  }
}
