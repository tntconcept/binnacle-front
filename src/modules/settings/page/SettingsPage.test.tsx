import SettingsPage from 'modules/settings/page/SettingsPage'
import { render } from 'test-utils/app-test-utils'

jest.mock('modules/settings/components/SettingsForm/SettingsForm', () => ({
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
