import { AttachmentRepository } from '../domain/attachment-repository'
import { Uuid } from '../domain/uuid'
import { injectable } from 'tsyringe'

@injectable()
export class FakeAttachmentRepository implements AttachmentRepository {
  async uploadAttachment(): Promise<{ id: Uuid }> {
    return {
      id: 'uuid'
    }
  }

  async getAttachment(uuid: Uuid): Promise<File> {
    return new File([uuid], 'image/jpeg')
  }
}
