import { OrganizationMother } from 'test-utils/mothers/organization-mother'
import { singleton } from 'tsyringe'
import { Organization } from '../domain/organization'
import { OrganizationRepository } from '../domain/organization-repository'

@singleton()
export class FakeOrganizationRepository implements OrganizationRepository {
  async getAll(): Promise<Organization[]> {
    return OrganizationMother.organizations()
  }
}
