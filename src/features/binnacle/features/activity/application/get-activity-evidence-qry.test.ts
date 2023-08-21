import { mock } from 'jest-mock-extended'
import { GetActivityEvidenceQry } from './get-activity-evidence-qry'
import { HttpAttachmentRepository } from '../../attachments/infrastructure/http-attachment-repository'

describe('GetActivityEvidenceQry', () => {
  it('should get an activity image by id', async () => {
    const { getActivityImageQry, urlToFileConverter } = setup()
    const id = 'foo'

    await getActivityImageQry.internalExecute(id)

    expect(urlToFileConverter.getAttachment).toBeCalledWith(id)
  })
})

function setup() {
  const httpAttachmentRepository = mock<HttpAttachmentRepository>()

  return {
    getActivityImageQry: new GetActivityEvidenceQry(httpAttachmentRepository),
    urlToFileConverter: httpAttachmentRepository
  }
}
