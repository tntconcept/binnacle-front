export interface VersionRepository {
  getApiVersion(): Promise<string>
}
