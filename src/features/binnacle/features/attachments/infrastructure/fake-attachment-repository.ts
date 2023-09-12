import { AttachmentRepository } from '../domain/attachment-repository'
import { injectable } from 'tsyringe'
import { Uuid } from '../../../../../shared/types/uuid'

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
