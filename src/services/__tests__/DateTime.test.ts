import DateTime from 'services/DateTime'
import { parseISO } from 'date-fns'
import mockDate from 'mockdate'

describe('DateTime', () => {
  it('should format relative as expected', function() {
    mockDate.set('2019-09-10 14:00:00')
    const relativeText = DateTime.relativeFormat(parseISO('2019-09-10'))

    expect(relativeText).toBe('Sep, Today')

    mockDate.reset()
  })

  test.each`
    date            | result
    ${'2019-09-10'} | ${'Sep, Today'}
    ${'2019-09-09'} | ${'Sep, Yesterday'}
    ${'2019-09-08'} | ${'Sep, Last Sunday'}
    ${'2019-09-01'} | ${'Sep, 01'}
    ${'2019-09-11'} | ${'Sep, Tomorrow'}
    ${'2019-09-16'} | ${'Sep, Next Monday'}
    ${'2019-10-01'} | ${'Oct, 01'}
  `('relative format for $date is $result', ({ date, result }) => {
  mockDate.set('2019-09-10 14:00:00')
  const relativeText = DateTime.relativeFormat(parseISO(date))

  expect(relativeText).toBe(result)

  mockDate.reset()
})
})
