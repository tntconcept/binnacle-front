import { Organization } from './organization'

export interface OrganizationRepository {
  getAll(): Promise<Organization[]>
}
