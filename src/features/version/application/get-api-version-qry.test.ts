import { describe, expect, it } from 'vitest'
import { GetApiVersionQry } from './get-api-version-qry'
import { mock } from 'vitest-mock-extended'
import { VersionRepository } from '../domain/version-repository'
import { VersionMother } from '../../../test-utils/mothers/version-mother'

describe('GetApiVersionQry', () => {
  it('should get api version from version repository', async () => {
    const { getApiVersionQry, versionRepository } = setup()
    const version = VersionMother.version()
    versionRepository.getApiVersion.mockResolvedValue(version)

    const response = await getApiVersionQry.internalExecute()

    expect(versionRepository.getApiVersion).toHaveBeenCalled()
    expect(response).toEqual(version)
  })
})

function setup() {
  const versionRepository = mock<VersionRepository>()

  return {
    versionRepository,
    getApiVersionQry: new GetApiVersionQry(versionRepository)
  }
}
