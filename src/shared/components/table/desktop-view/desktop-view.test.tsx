import { render, screen, userEvent, waitFor } from 'test-utils/app-test-utils'
import DesktopView from './desktop-view'

const jestFn = jest.fn()

describe('Table', () => {
  it('should render desktop table', async () => {
    setup()

    const elements = await screen.findAllByTestId('action')
    userEvent.click(elements[0])

    await waitFor(() => {
      expect(jestFn).toHaveBeenCalled()
    })

    expect(await screen.findByText('Name')).toBeInTheDocument()
    expect(await screen.findByText('Age')).toBeInTheDocument()
    expect(await screen.findByText('Address')).toBeInTheDocument()
    expect(await screen.findByText('Action')).toBeInTheDocument()
  })
})

function setup() {
  render(<DesktopView columns={columns} dataSource={dataSource} emptyTableKey="any-key" />)
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: () => (
      <a data-testid="action" onClick={jestFn}>
        click me
      </a>
    )
  }
]

const dataSource = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  }
]
