import { Organization } from './organization'
import { OrganizationFilters } from './organization-filters'

export interface OrganizationRepository {
  getAll(organizationFilters?: OrganizationFilters): Promise<Organization[]>
}
