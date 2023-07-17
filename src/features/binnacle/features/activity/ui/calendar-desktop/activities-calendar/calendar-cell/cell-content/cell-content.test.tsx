import { CellContent } from './cell-content'
import { ActivityMother } from '../../../../../../../../../test-utils/mothers/activity-mother'
import { fireEvent } from '@testing-library/react'
import { render, screen } from '../../../../../../../../../test-utils/app-test-utils'

describe('CellContent', () => {
  it('should call open create activity form', () => {
    const { onClickSpy, activityDay } = setup()

    fireEvent.click(screen.getByText('Click me!'))

    expect(onClickSpy).toHaveBeenCalledWith(activityDay.date)
  })
})

const setup = () => {
  const selectedMonth = new Date()
  const activityDaySummary = ActivityMother.marchActivitySummary()
  const onClickSpy = jest.fn()
  render(
    <CellContent
      selectedMonth={selectedMonth}
      borderBottom={false}
      activityDaySummary={activityDaySummary[0]}
      onClick={onClickSpy}
    >
      Click me!
    </CellContent>
  )

  return {
    onClickSpy,
    activityDay: activityDaySummary[0]
  }
}
