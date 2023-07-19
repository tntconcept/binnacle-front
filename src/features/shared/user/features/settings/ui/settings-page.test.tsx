import { render } from '../../../../../../test-utils/app-test-utils'
import { SettingsPage } from './settings-page'

jest.mock('./components/settings-form/settings-form', () => ({
  SettingsForm: () => {
    return <div />
  }
}))

describe('SettingsPage', () => {
  it('should update document title', async () => {
    setup()

    expect(document.title).toEqual('pages.settings')
  })
})

function setup() {
  render(<SettingsPage />)
}
