import { render } from 'test-utils/app-test-utils'
import { buildActivityDaySummary } from 'test-utils/generateTestMocks'
import { CellContent } from './cell-content'

describe('CellContent', () => {
  it('should call open create activity form', () => {
    // TODO
  })
})

const setup = () => {
  const selectedMonth = new Date()
  const activityDaySummary = buildActivityDaySummary()

  render(
    <CellContent
      selectedMonth={selectedMonth}
      borderBottom={false}
      activityDaySummary={activityDaySummary[0]}
    >
      Click me!
    </CellContent>
  )

  return {
    activityDay: activityDaySummary
  }
}
