import { Command } from '@archimedes/arch'
import { inject, injectable } from 'tsyringe'
import type { AttachmentRepository } from '../domain/attachment-repository'
import { ATTACHMENT_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { Uuid } from '../domain/uuid'

@injectable()
export class UploadAttachmentCmd extends Command<File, { id: Uuid }> {
  constructor(
    @inject(ATTACHMENT_REPOSITORY) private readonly attachmentRepository: AttachmentRepository
  ) {
    super()
  }

  internalExecute(file: File): Promise<{ id: Uuid }> {
    return this.attachmentRepository.uploadAttachment(file)
  }
}
