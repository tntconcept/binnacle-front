import { render, screen, userEvent, waitFor } from '../../../test-utils/render'
import { TextWithTooltip } from './text-with-tooltip'

describe('TextWithTooltip', () => {
  it('should show text tooltip', async function () {
    setup()

    const button = screen.getByTestId('tooltip_text')

    userEvent.hover(button)

    await waitFor(() => {
      expect(screen.getByTestId('tooltip_content')).toBeInTheDocument()
    })
  })
})

const setup = () => {
  render(<TextWithTooltip text={'foo'} tooltipContent={'tooltip foo'} />)
}
