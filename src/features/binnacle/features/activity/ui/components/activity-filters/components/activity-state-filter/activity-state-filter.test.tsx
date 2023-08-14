import { describe, expect, it, vi } from 'vitest'
import { ActivityStateFilter } from './activity-state-filter'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('ActivityStateFilter', () => {
  it('should have default value as selected option', () => {
    setup()

    const selectedElement = screen.getByRole('option', { selected: true })
    expect(selectedElement).toHaveValue('PENDING')
  })

  it('should emit on change with selected value', async () => {
    const { onChange } = setup()

    await act(async () => {
      await userEvent.selectOptions(screen.getByTestId('activity_state_filter'), 'ALL')
    })

    expect(onChange).toHaveBeenCalledWith('ALL')
  })

  const setup = () => {
    const mockFn = vi.fn()

    render(<ActivityStateFilter onChange={mockFn} defaultValue={'PENDING'}></ActivityStateFilter>)

    return { onChange: mockFn }
  }
})
