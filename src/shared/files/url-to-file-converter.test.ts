import { UrlToFileConverter } from './url-to-file-converter'
import { mock } from 'jest-mock-extended'
import { HttpClient } from '../http/http-client'

describe('UrlToFileConverter', () => {
  it('should convert url to file', async () => {
    const { urlToFileConverter, httpClient } = setup()

    await urlToFileConverter.convert('foo')

    expect(httpClient.get).toHaveBeenCalledWith('foo', { responseType: 'blob' })
  })
})

function setup() {
  const httpClient = mock<HttpClient>()
  return {
    httpClient,
    urlToFileConverter: new UrlToFileConverter(httpClient)
  }
}
