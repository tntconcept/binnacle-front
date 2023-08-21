import { mock } from 'jest-mock-extended'
import { HttpClient } from '../../../../../shared/http/http-client'
import { HttpAttachmentRepository } from './http-attachment-repository'

describe('HttpAttachmentRepository', () => {
  it('should upload attachment', async () => {
    const { httpAttachmentRepository, httpClient } = setup()

    const file = new File([], 'image/jpeg')

    const formData = new FormData()
    formData.append('attachmentFile', file)
    await httpAttachmentRepository.uploadAttachment(file)

    expect(httpClient.post).toHaveBeenCalledWith('/api/attachment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  })

  it('should get attachment', async () => {
    const { httpAttachmentRepository, httpClient } = setup()

    await httpAttachmentRepository.getAttachment('foo')

    expect(httpClient.get).toHaveBeenCalledWith('/api/attachment/foo', { responseType: 'blob' })
  })
})

function setup() {
  const httpClient = mock<HttpClient>()
  return {
    httpClient,
    httpAttachmentRepository: new HttpAttachmentRepository(httpClient)
  }
}
