export interface ApiVersionRepository {
  getApiVersion(): Promise<string>
}
