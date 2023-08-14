import { describe, expect, it, vi } from 'vitest'
import { render, screen, userEvent } from '../../../../../../../../../test-utils/render'
import { CellBody } from './cell-body'
import { ActivityWithRenderDays } from '../../../../../domain/activity-with-render-days'
import { ActivityMother } from '../../../../../../../../../test-utils/mothers/activity-mother'
import { TimeUnits } from '../../../../../../../../../shared/types/time-unit'

vi.mock('../cell-activity-button/cell-activity-button.tsx', () => {
  return {
    CellActivityButton: (props: any) => <button>{props.activity.description}</button>
  }
})

describe('CellBody', () => {
  it('should trap focus', async () => {
    setup(true, [
      ActivityMother.activityWithRenderDays(),
      ActivityMother.activityWithRenderDays({
        id: 2,
        description: 'Minutes activity 2',
        interval: {
          start: new Date('2023-03-01T14:00:00.000Z'),
          end: new Date('2023-03-01T18:00:00.000Z'),
          duration: 240,
          timeUnit: TimeUnits.MINUTES
        }
      })
    ])

    expect(screen.getByText('accessibility.new_activity')).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByText('Minutes activity')).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByText('Minutes activity 2')).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByText('outside button')).not.toHaveFocus()

    expect(screen.getByText('accessibility.new_activity')).toHaveFocus()
  })

  it('should not trap focus', async () => {
    setup(false, [
      ActivityMother.activityWithRenderDays(),
      ActivityMother.activityWithRenderDays({
        id: 2,
        description: 'Minutes activity 2',
        interval: {
          start: new Date('2023-03-01T14:00:00.000Z'),
          end: new Date('2023-03-01T18:00:00.000Z'),
          duration: 240,
          timeUnit: TimeUnits.MINUTES
        }
      })
    ])

    await userEvent.tab()
    expect(screen.getByText('accessibility.new_activity')).not.toHaveFocus()
    expect(screen.getByText('Minutes activity')).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByText('Minutes activity 2')).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByText('outside button')).toHaveFocus()
  })

  it('should disable trap on escape key', async () => {
    const { mockOnEscKey } = setup(true, [])

    await userEvent.keyboard('{Escape}')

    expect(mockOnEscKey).toHaveBeenCalled()
  })
})

const setup = (isSelected: boolean, activities: ActivityWithRenderDays[]) => {
  const mockOnEscKey = vi.fn()

  render(
    <>
      <CellBody
        isSelected={isSelected}
        onEscKey={mockOnEscKey}
        activities={activities}
        onActivityClicked={() => {}}
      />
      <button>outside button</button>
    </>
  )

  return {
    mockOnEscKey
  }
}
