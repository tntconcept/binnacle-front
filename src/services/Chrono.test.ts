import chrono, { parseISO } from 'services/Chrono'

describe('Chrono', () => {
  it('should format relative as expected', function() {
    chrono.now = new Date('2019-09-10 14:00:00')
    const relativeText = chrono(parseISO('2019-09-10')).formatRelative()

    expect(relativeText).toBe('Sep, Today')
  })

  test.each`
    date            | result
    ${'2019-09-09'} | ${'Sep, Today'}
    ${'2019-09-08'} | ${'Sep, Yesterday'}
    ${'2019-09-07'} | ${'Sep, Last Saturday'}
    ${'2019-09-02'} | ${'Sep, Last Monday'}
    ${'2019-09-01'} | ${'September'}
    ${'2019-09-10'} | ${'Sep, Tomorrow'}
    ${'2019-09-16'} | ${'Sep, Next Monday'}
    ${'2019-10-01'} | ${'October'}
  `('relative format for $date is $result', ({ date, result }) => {
    chrono.now = new Date('2019-09-09 14:00:00')

    // Monday
    const relativeText = chrono(parseISO(date)).formatRelative()

    expect(relativeText).toBe(result)
  })
})
