import { mock } from 'jest-mock-extended'
import { OrganizationRepository } from '../domain/organization-repository'
import { GetOrganizationsQry } from './get-organizations-qry'
import { OrganizationMother } from '../../../../../test-utils/mothers/organization-mother'

describe('GetHolidaysQry', () => {
  it('should get holidays from repository', async () => {
    const { getOrganizationQry, organizationRepository } = setup()
    const organizations = OrganizationMother.organizations()
    organizationRepository.getAll.mockResolvedValue(organizations)

    const response = await getOrganizationQry.internalExecute({ imputable: true })

    expect(organizationRepository.getAll).toHaveBeenCalled()
    expect(response).toEqual(organizations)
  })
})

function setup() {
  const organizationRepository = mock<OrganizationRepository>()

  return {
    organizationRepository,
    getOrganizationQry: new GetOrganizationsQry(organizationRepository)
  }
}
