import { ColumnsProps } from '../table.types'
import { MobileView } from './mobile-view'
import { render, screen, userEvent, waitFor } from '../../../../test-utils/render'

const actionClicked = jest.fn()

describe('MobileView', () => {
  it('should render mobile table view', async () => {
    setup(dataSource)

    const elements = await screen.findAllByTestId('action')

    await userEvent.click(elements[0])

    await waitFor(() => {
      expect(actionClicked).toHaveBeenCalled()
    })

    expect(screen.getByText('Age')).toBeVisible()
    expect(screen.queryByText('HeadingName')).toBeNull()
    expect(screen.queryByText('HeadingAddress')).toBeNull()
    expect(screen.queryByText('HeadingAction')).toBeNull()
  })

  it('should render an empty mobile view', async () => {
    setup([])

    expect(screen.getByTestId('empty-mobile-view')).toBeInTheDocument()
  })
})

function setup(data: any[]) {
  render(<MobileView columns={columns} dataSource={data} emptyTableKey="any-key" />)
}

const columns: ColumnsProps[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    showInMobile: true
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
    render: (_, key) => (
      <a key={key} data-testid="action" onClick={actionClicked}>
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
