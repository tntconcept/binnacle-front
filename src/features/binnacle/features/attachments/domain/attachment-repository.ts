import { Uuid } from './uuid'

export interface AttachmentRepository {
  uploadAttachment(attachment: File): Promise<{ id: Uuid }>
}
