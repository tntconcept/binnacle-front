import { singleton } from 'tsyringe'
import { VersionRepository } from '../domain/version-repository'
import { VersionMother } from '../../../test-utils/mothers/version-mother'

@singleton()
export class FakeVersionRepository implements VersionRepository {
  async getApiVersion(): Promise<string> {
    return VersionMother.version()
  }
}
