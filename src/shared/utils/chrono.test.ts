import chrono, { parseISO, getHumanizedDuration } from 'shared/utils/chrono'

describe('Chrono', () => {
  it('should format relative as expected', function () {
    chrono.now = jest.fn(() => new Date('2019-09-10 14:00:00'))
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
    chrono.now = jest.fn(() => new Date('2019-09-09 14:00:00'))

    // Monday
    const relativeText = chrono(parseISO(date)).formatRelative()

    expect(relativeText).toBe(result)
  })

  test.each`
    duration | abbreviation | negative | result
    ${0}     | ${true}      | ${false} | ${''}
    ${60}    | ${true}      | ${false} | ${'1h'}
    ${90}    | ${true}      | ${false} | ${'1h 30min'}
    ${61}    | ${true}      | ${false} | ${'1h 1min'}
    ${61.5}  | ${true}      | ${false} | ${'1h 1.5min'}
    ${0}     | ${false}     | ${false} | ${''}
    ${60}    | ${false}     | ${false} | ${'1 time.hour'}
    ${90}    | ${false}     | ${false} | ${'1 time.hour 30 time.minute'}
    ${61}    | ${false}     | ${false} | ${'1 time.hour 1 time.minute'}
    ${61.5}  | ${false}     | ${false} | ${'1 time.hour 1.5 time.minute'}
    ${-60}   | ${true}      | ${false} | ${'1h'}
    ${-90}   | ${true}      | ${false} | ${'1h 30min'}
    ${-61}   | ${true}      | ${false} | ${'1h 1min'}
    ${-61.5} | ${true}      | ${false} | ${'1h 1.5min'}
    ${-60}   | ${false}     | ${false} | ${'1 time.hour'}
    ${-90}   | ${false}     | ${false} | ${'1 time.hour 30 time.minute'}
    ${-61}   | ${false}     | ${false} | ${'1 time.hour 1 time.minute'}
    ${-61.5} | ${false}     | ${false} | ${'1 time.hour 1.5 time.minute'}
    ${0}     | ${true}      | ${true}  | ${''}
  `(
    'should format duration strings in human readable way',
    function ({ duration, abbreviation, negative, result }) {
      const humanDuration = getHumanizedDuration(duration, abbreviation, negative)

      expect(humanDuration).toBe(result)
    }
  )
})
