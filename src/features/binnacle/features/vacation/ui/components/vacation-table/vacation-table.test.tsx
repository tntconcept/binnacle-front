import { VacationTable } from 'modules/vacations/components/VacationTable/VacationTable'
import { render, screen } from 'test-utils/app-test-utils'

jest.mock(
  'modules/vacations/components/VacationTable/VacationTableDesktop/VacationTable.desktop',
  () => ({
    __esModule: true,
    default: () => <p>desktop table</p>
  })
)

jest.mock(
  'modules/vacations/components/VacationTable/VacationTableMobile/VacationTable.mobile',
  () => ({
    __esModule: true,
    default: () => <p>mobile table</p>
  })
)

describe('VacationTable', () => {
  test('should render skeleton when loading', () => {
    setup(false, true)

    expect(screen.getByTestId('vacation-table-skeleton')).toBeInTheDocument()
  })

  test('should render desktop table', async () => {
    setup(false, false)

    expect(await screen.findByText('desktop table')).toBeInTheDocument()
  })

  test('should render mobile table', async () => {
    setup(true, false)

    expect(await screen.findByText('mobile table')).toBeInTheDocument()
  })
})

function setup(isMobile: boolean, isLoading: boolean) {
  render(
    <VacationTable
      isMobile={isMobile}
      loading={isLoading}
      vacations={[]}
      onUpdateVacation={jest.fn()}
    />
  )
}
