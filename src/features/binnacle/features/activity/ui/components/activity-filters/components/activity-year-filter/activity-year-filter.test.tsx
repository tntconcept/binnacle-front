import { ActivityYearFilter } from './activity-year-filter'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../../../../../../../../test-utils/render'

describe('ActivityYearFilter', () => {
  it('should have default value as selected option', () => {
    setup()

    const selectedElement = screen.getByRole('option', { selected: true })
    expect(selectedElement).toHaveValue('2023')
  })

  it('should emit on change with selected value', async () => {
    const { onChange } = setup()

    await userEvent.selectOptions(screen.getByTestId('select'), '2020')

    expect(onChange).toHaveBeenCalledWith(2020)
  })

  const setup = () => {
    const mockFn = jest.fn()
    render(<ActivityYearFilter onChange={mockFn} defaultValue={2023}></ActivityYearFilter>)
    return { onChange: mockFn }
  }
})
