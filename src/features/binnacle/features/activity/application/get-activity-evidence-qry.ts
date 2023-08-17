import { Query, UseCaseKey } from '@archimedes/arch'
import { singleton } from 'tsyringe'
import { Uuid } from '../../attachments/domain/uuid'
import { UrlToFileConverter } from '../../../../../shared/files/url-to-file-converter'
import { Url } from '../../../../../shared/types/url'

@UseCaseKey('GetActivityEvidenceQry')
@singleton()
export class GetActivityEvidenceQry extends Query<File, Uuid> {
  constructor(private readonly urlToFileConverter: UrlToFileConverter) {
    super()
  }

  async internalExecute(url: Url): Promise<File> {
    return this.urlToFileConverter.convert(url)
  }
}
