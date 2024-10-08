import { render, screen } from '../../../test-utils/render'
import { Table } from './table'
import { useIsMobile } from '../../hooks/use-is-mobile'

jest.mock('./desktop-view/desktop-view', () => ({
  __esModule: true,
  DesktopView: () => <p>desktop table</p>
}))
jest.mock('./mobile-view/mobile-view', () => ({
  __esModule: true,
  MobileView: () => <p>mobile table</p>
}))
jest.mock('../../hooks/use-is-mobile')

describe('Table', () => {
  it('should render desktop table', async () => {
    ;(useIsMobile as jest.Mock).mockReturnValue(false)
    setup()

    expect(await screen.findByText('desktop table')).toBeInTheDocument()
  })

  it('should render mobile table', async () => {
    ;(useIsMobile as jest.Mock).mockReturnValue(true)
    setup()

    expect(await screen.findByText('mobile table')).toBeInTheDocument()
  })
})

function setup() {
  render(<Table columns={[]} dataSource={[]} emptyTableKey="any-key" />)
}
