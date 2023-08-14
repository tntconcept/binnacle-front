import { describe, expect, it, Mock, vi } from 'vitest'
import { render, screen } from '../../../test-utils/render'
import { Table } from './table'
import { useIsMobile } from '../../hooks/use-is-mobile'

vi.mock('./desktop-view/desktop-view', () => ({
  __esModule: true,
  DesktopView: () => <p>desktop table</p>
}))
vi.mock('./mobile-view/mobile-view', () => ({
  __esModule: true,
  MobileView: () => <p>mobile table</p>
}))
vi.mock('../../hooks/use-is-mobile')

describe('Table', () => {
  it('should render desktop table', async () => {
    ;(useIsMobile as Mock).mockReturnValue(false)
    setup()

    expect(await screen.findByText('desktop table')).toBeInTheDocument()
  })

  it('should render mobile table', async () => {
    ;(useIsMobile as Mock).mockReturnValue(true)
    setup()

    expect(await screen.findByText('mobile table')).toBeInTheDocument()
  })
})

function setup() {
  render(<Table columns={[]} dataSource={[]} emptyTableKey="any-key" />)
}
