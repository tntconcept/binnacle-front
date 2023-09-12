import { AttachmentRepository } from '../domain/attachment-repository'
import { injectable } from 'tsyringe'
import { HttpClient } from '../../../../../shared/http/http-client'
import { Uuid } from '../../../../../shared/types/uuid'

@injectable()
export class HttpAttachmentRepository implements AttachmentRepository {
  protected static attachmentPath = '/api/attachment'

  constructor(private readonly httpClient: HttpClient) {}

  async uploadAttachment(attachment: File): Promise<{ id: Uuid }> {
    const formData = new FormData()
    formData.append('attachmentFile', attachment)
    return this.httpClient.post(HttpAttachmentRepository.attachmentPath, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async getAttachment(uuid: Uuid): Promise<File> {
    return this.httpClient.get<File>(`${HttpAttachmentRepository.attachmentPath}/${uuid}`, {
      responseType: 'blob'
    })
  }
}
