import { Query, UseCaseKey } from '@archimedes/arch'
import { singleton } from 'tsyringe'
import { HttpAttachmentRepository } from '../../attachments/infrastructure/http-attachment-repository'
import { Uuid } from '../../../../../shared/types/uuid'

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
