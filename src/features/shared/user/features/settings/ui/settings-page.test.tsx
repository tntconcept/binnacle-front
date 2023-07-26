import { render } from '../../../../../../test-utils/render'
import SettingsPage from './settings-page'

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
