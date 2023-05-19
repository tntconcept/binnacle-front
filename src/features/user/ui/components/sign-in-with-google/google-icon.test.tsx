import { render } from '../../../../../test-utils/app-test-utils'
import { GoogleIcon } from './google-icon'

describe('GoogleIcon', () => {
  const setup = () => render(<GoogleIcon />)

  it('should render the Google SVG', () => {
    setup()
    expect(document.querySelector('svg')).toBeInTheDocument()
  })
})
