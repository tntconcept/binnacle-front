import { describe, expect, it } from 'vitest'
import { mock } from 'vitest-mock-extended'
import { OrganizationMother } from '../../../../../test-utils/mothers/organization-mother'
import { HttpClient } from '../../../../../shared/http/http-client'
import { HttpOrganizationRepository } from './http-organization-repository'

describe('HttpOrganizationRepository', () => {
  it('should call http client for organizations', async () => {
    const { httpClient, httpOrganizationRepository } = setup()
    const organizations = OrganizationMother.organizations()
    httpClient.get.mockResolvedValue(OrganizationMother.organizations())

    const result = await httpOrganizationRepository.getAll()

    expect(httpClient.get).toHaveBeenCalled()
    expect(result).toEqual(organizations)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    httpOrganizationRepository: new HttpOrganizationRepository(httpClient)
  }
}
