import { injectable } from 'tsyringe'
import { HttpClient } from '../http/http-client'

@injectable()
export class UrlToFileConverter {
  constructor(private readonly httpClient: HttpClient) {}

  convert(url: string): Promise<File> {
    return this.httpClient.get<File>(url, { responseType: 'blob' })
  }
}
