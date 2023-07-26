import { render, screen, userEvent, waitFor } from '../../../../test-utils/render'
import { DesktopView } from './desktop-view'

const jestFn = jest.fn()

describe('DesktopView', () => {
  it('should render desktop table', async () => {
    setup(dataSource)

    const elements = await screen.findAllByTestId('action')
    userEvent.click(elements[0])

    await waitFor(() => {
      expect(jestFn).toHaveBeenCalled()
    })

    expect(await screen.findByText('Name')).toBeVisible()
    expect(await screen.findByText('Age')).toBeVisible()
    expect(await screen.findByText('Address')).toBeVisible()
    expect(await screen.findByText('Action')).toBeVisible()
  })

  it('should render an empty desktop view', async () => {
    setup([])

    expect(screen.getByTestId('empty-desktop-view')).toBeVisible()
  })
})

function setup(data: any[]) {
  const bgColor = jest.fn()
  render(
    <DesktopView columns={columns} dataSource={data} emptyTableKey="any-key" bgColor={bgColor} />
  )
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
