import { AttachmentRepository } from '../domain/attachment-repository'
import { Uuid } from '../domain/uuid'
import { injectable } from 'tsyringe'
import { HttpClient } from '../../../../../shared/http/http-client'

@injectable()
export class HttpAttachmentRepository implements AttachmentRepository {
  protected static attachmentPath = '/api/attachment'

  constructor(private readonly httpClient: HttpClient) {}

  async uploadAttachment(attachment: File): Promise<{ id: Uuid }> {
    const formData = new FormData()
    formData.append('file', attachment)
    return this.httpClient.post(HttpAttachmentRepository.attachmentPath, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
