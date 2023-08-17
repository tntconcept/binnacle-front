import { mock } from 'jest-mock-extended'
import { GetActivityEvidenceQry } from './get-activity-evidence-qry'
import { UrlToFileConverter } from '../../../../../shared/files/url-to-file-converter'

describe('GetActivityEvidenceQry', () => {
  it('should get an activity image by id', async () => {
    const { getActivityImageQry, urlToFileConverter } = setup()
    const id = 'foo'

    await getActivityImageQry.internalExecute(id)

    expect(urlToFileConverter.convert).toBeCalledWith(id)
  })
})

function setup() {
  const urlToFileConverter = mock<UrlToFileConverter>()

  return {
    getActivityImageQry: new GetActivityEvidenceQry(urlToFileConverter),
    urlToFileConverter
  }
}
