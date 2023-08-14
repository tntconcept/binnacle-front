import { describe, expect, Mock, it, vi } from 'vitest'
import { render, screen } from '../../../../../../../test-utils/render'
import { VacationTable } from './vacation-table'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'

vi.mock('../../../../../../../shared/arch/hooks/use-subscribe-to-use-case')
vi.mock('../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount')
vi.mock('./vacation-table-desktop/vacation-table.desktop', () => ({
  __esModule: true,
  default: () => <p>desktop table</p>
}))

vi.mock('./vacation-table-mobile/vacation-table.mobile', () => ({
  __esModule: true,
  default: () => <p>mobile table</p>
}))

describe('VacationTable', () => {
  it('should render skeleton when loading', () => {
    setup(false, true)

    expect(screen.getByTestId('vacation-table-skeleton')).toBeInTheDocument()
  })

  it('should render desktop table', async () => {
    setup(false)

    expect(await screen.findByText('desktop table')).toBeInTheDocument()
  })

  it('should render mobile table', async () => {
    setup(true)

    expect(await screen.findByText('mobile table')).toBeInTheDocument()
  })
})

function setup(isMobile: boolean, isLoading?: boolean) {
  ;(useExecuteUseCaseOnMount as Mock).mockReturnValue({
    isLoading: isLoading,
    result: []
  })
  render(<VacationTable isMobile={isMobile} chargeYear={2020} onUpdateVacation={vi.fn()} />)
}
