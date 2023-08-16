import { mock } from 'jest-mock-extended'
import { GetActivityEvidenceQry } from './get-activity-evidence-qry'
import { HttpClient } from '../../../../../shared/http/http-client'

describe('GetActivityEvidenceQry', () => {
  it('should get an activity image by id', async () => {
    const { getActivityImageQry, httpClient } = setup()
    const id = 'foo'

    await getActivityImageQry.internalExecute(id)

    expect(httpClient.get).toBeCalledWith(id)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    getActivityImageQry: new GetActivityEvidenceQry(httpClient),
    httpClient
  }
}
