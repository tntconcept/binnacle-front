import { Query, UseCaseKey } from '@archimedes/arch'
import { ORGANIZATION_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { Organization } from '../domain/organization'
import type { OrganizationRepository } from '../domain/organization-repository'

@UseCaseKey('GetOrganizationsQry')
@singleton()
export class GetOrganizationsQry extends Query<Organization[]> {
  constructor(
    @inject(ORGANIZATION_REPOSITORY) private organizationRepository: OrganizationRepository
  ) {
    super()
  }

  internalExecute(): Promise<Organization[]> {
    return this.organizationRepository.getAll()
  }
}
