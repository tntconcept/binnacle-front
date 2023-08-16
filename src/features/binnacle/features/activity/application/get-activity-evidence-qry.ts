import { Query, UseCaseKey } from '@archimedes/arch'
import { singleton } from 'tsyringe'
import { Uuid } from '../../attachments/domain/uuid'
import { HttpClient } from '../../../../../shared/http/http-client'

@UseCaseKey('GetActivityEvidenceQry')
@singleton()
export class GetActivityEvidenceQry extends Query<File, Uuid> {
  constructor(private readonly httpClient: HttpClient) {
    super()
  }

  async internalExecute(id: Uuid): Promise<File> {
    return this.httpClient.get<File>(id, { responseType: 'blob' })
  }
}
