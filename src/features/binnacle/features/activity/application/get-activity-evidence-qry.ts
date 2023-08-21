import { Query, UseCaseKey } from '@archimedes/arch'
import { singleton } from 'tsyringe'
import { Uuid } from '../../attachments/domain/uuid'
import { HttpAttachmentRepository } from '../../attachments/infrastructure/http-attachment-repository'

@UseCaseKey('GetActivityEvidenceQry')
@singleton()
export class GetActivityEvidenceQry extends Query<File, Uuid> {
  constructor(private readonly httpAttachmentRepository: HttpAttachmentRepository) {
    super()
  }

  async internalExecute(uuid: Uuid): Promise<File> {
    return this.httpAttachmentRepository.getAttachment(uuid)
  }
}
