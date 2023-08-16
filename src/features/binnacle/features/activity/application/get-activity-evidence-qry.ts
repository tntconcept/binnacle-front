import { Query, UseCaseKey } from '@archimedes/arch'
import { singleton } from 'tsyringe'
import { Uuid } from '../../attachments/domain/uuid'

@UseCaseKey('GetActivityEvidenceQry')
@singleton()
export class GetActivityEvidenceQry extends Query<File, Uuid> {
  async internalExecute(id: Uuid): Promise<File> {
    const blob = await fetch(`http://localhost:8080${id}`, {
      method: 'GET',
      credentials: 'include'
    })
    const file = await blob.blob()
    return new File([file], file.name ?? '', {
      type: file.type
    })
  }
}
