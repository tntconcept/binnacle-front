import { Uuid } from '../../../../../shared/types/uuid'

export interface AttachmentRepository {
  uploadAttachment(attachment: File): Promise<{ id: Uuid }>

  getAttachment(uuid: Uuid): Promise<File>
}
