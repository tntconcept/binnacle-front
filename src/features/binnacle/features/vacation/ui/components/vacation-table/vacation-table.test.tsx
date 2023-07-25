import { render, screen } from '../../../../../../../test-utils/app-test-utils'
import { VacationTable } from './vacation-table'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'

jest.mock('../../../../../../../shared/arch/hooks/use-subscribe-to-use-case')
jest.mock('../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount')
jest.mock('./vacation-table-desktop/vacation-table.desktop', () => ({
  __esModule: true,
  default: () => <p>desktop table</p>
}))

jest.mock('./vacation-table-mobile/vacation-table.mobile', () => ({
  __esModule: true,
  default: () => <p>mobile table</p>
}))

describe('VacationTable', () => {
  test('should render skeleton when loading', () => {
    setup(false, true)

    expect(screen.getByTestId('vacation-table-skeleton')).toBeInTheDocument()
  })

  test('should render desktop table', async () => {
    setup(false)

    expect(await screen.findByText('desktop table')).toBeInTheDocument()
  })

  test('should render mobile table', async () => {
    setup(true)

    expect(await screen.findByText('mobile table')).toBeInTheDocument()
  })
})

function setup(isMobile: boolean, isLoading?: boolean) {
  ;(useExecuteUseCaseOnMount as jest.Mock).mockReturnValue({
    isLoading: isLoading,
    result: []
  })
  render(<VacationTable isMobile={isMobile} chargeYear={2020} onUpdateVacation={jest.fn()} />)
}
