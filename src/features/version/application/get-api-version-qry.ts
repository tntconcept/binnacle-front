import { Query, UseCaseKey } from '@archimedes/arch'
import { VERSION_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { VersionRepository } from '../domain/version-repository'

@UseCaseKey('GetApiVersionQry')
@singleton()
export class GetApiVersionQry extends Query<string> {
  constructor(@inject(VERSION_REPOSITORY) private versionRepository: VersionRepository) {
    super()
  }
  internalExecute(): Promise<string> {
    return this.versionRepository.getApiVersion()
  }
}
