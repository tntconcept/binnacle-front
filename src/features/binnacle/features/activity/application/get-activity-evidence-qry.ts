import { Query, UseCaseKey } from '@archimedes/arch'
import { singleton } from 'tsyringe'
import { HttpClient } from '../../../../../shared/http/http-client'
import { Uuid } from '../../attachments/domain/uuid'

@UseCaseKey('GetActivityEvidenceQry')
@singleton()
export class GetActivityEvidenceQry extends Query<File, Uuid> {
  constructor(private readonly httpClient: HttpClient) {
    super()
  }

  async internalExecute(id: Uuid): Promise<File> {
    const blob = await this.httpClient.get<Blob>(id)
    return new File([blob], 'evidence')
  }
}
