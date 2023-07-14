import {
  chrono,
  getHumanizedDuration,
  getNearestTimeOption,
  getWeeksInMonth,
  parseISO
} from './chrono'

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
    duration | abbreviation | result
    ${0}     | ${true}      | ${''}
    ${30}    | ${true}      | ${'30min'}
    ${60}    | ${true}      | ${'1h'}
    ${90}    | ${true}      | ${'1h 30min'}
    ${61}    | ${true}      | ${'1h 1min'}
    ${61.5}  | ${true}      | ${'1h 1.5min'}
    ${0}     | ${false}     | ${''}
    ${30}    | ${false}     | ${'30 time.minute'}
    ${60}    | ${false}     | ${'1 time.hour'}
    ${90}    | ${false}     | ${'1 time.hour 30 time.minute'}
    ${61}    | ${false}     | ${'1 time.hour 1 time.minute'}
    ${61.5}  | ${false}     | ${'1 time.hour 1.5 time.minute'}
    ${-30}   | ${true}      | ${'30min'}
    ${-60}   | ${true}      | ${'1h'}
    ${-90}   | ${true}      | ${'1h 30min'}
    ${-61}   | ${true}      | ${'1h 1min'}
    ${-61.5} | ${true}      | ${'1h 1.5min'}
    ${-30}   | ${false}     | ${'30 time.minute'}
    ${-60}   | ${false}     | ${'1 time.hour'}
    ${-90}   | ${false}     | ${'1 time.hour 30 time.minute'}
    ${-61}   | ${false}     | ${'1 time.hour 1 time.minute'}
    ${-61.5} | ${false}     | ${'1 time.hour 1.5 time.minute'}
    ${0}     | ${true}      | ${''}
  `(
    'should format duration strings in human readable way, with negative numbers excluded',
    function ({ duration, abbreviation, result }) {
      const humanDuration = getHumanizedDuration({ duration, abbreviation })

      expect(humanDuration).toBe(result)
    }
  )

  test.each`
    duration | abbreviation | addSign  | result
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
    ${30}    | ${true}      | ${true}  | ${'+30min'}
    ${60}    | ${true}      | ${true}  | ${'+1h'}
    ${90}    | ${true}      | ${true}  | ${'+1h 30min'}
    ${61}    | ${true}      | ${true}  | ${'+1h 1min'}
    ${61.5}  | ${true}      | ${true}  | ${'+1h 1.5min'}
    ${-30}   | ${true}      | ${true}  | ${'-30min'}
    ${-60}   | ${true}      | ${true}  | ${'-1h'}
    ${-90}   | ${true}      | ${true}  | ${'-1h 30min'}
    ${-61}   | ${true}      | ${true}  | ${'-1h 1min'}
    ${-61.5} | ${true}      | ${true}  | ${'-1h 1.5min'}
    ${-30}   | ${false}     | ${true}  | ${'-30 time.minute'}
    ${-60}   | ${false}     | ${true}  | ${'-1 time.hour'}
    ${-90}   | ${false}     | ${true}  | ${'-1 time.hour 30 time.minute'}
    ${-61}   | ${false}     | ${true}  | ${'-1 time.hour 1 time.minute'}
    ${-61.5} | ${false}     | ${true}  | ${'-1 time.hour 1.5 time.minute'}
  `(
    'should format duration strings in human readable way, with negative numbers included',
    function ({ duration, abbreviation, addSign, result }) {
      const humanDuration = getHumanizedDuration({ duration, abbreviation, addSign })

      expect(humanDuration).toBe(result)
    }
  )

  test.each`
    selectedDate    | result
    ${'2023-01-01'} | ${6}
    ${'2023-02-01'} | ${5}
    ${'2023-03-01'} | ${5}
    ${'2023-04-01'} | ${5}
    ${'2023-05-01'} | ${5}
    ${'2023-07-01'} | ${6}
    ${'2023-12-01'} | ${5}
  `('should get $result weeks for $selectedDate', function ({ selectedDate, result }) {
    const weeksInMonth = getWeeksInMonth(parseISO(selectedDate))

    expect(weeksInMonth).toBe(result)
  })

  test.each`
    invalidTime | result
    ${'02:07'}  | ${'02:00'}
    ${'06:32'}  | ${'06:30'}
    ${'06:39'}  | ${'06:45'}
    ${'09:59'}  | ${'09:45'}
    ${'10:24'}  | ${'10:30'}
    ${'11:09'}  | ${'11:15'}
    ${'17:46'}  | ${'17:45'}
    ${'19:22'}  | ${'19:15'}
    ${'19:23'}  | ${'19:30'}
    ${'99:99'}  | ${'23:45'}
  `('should return the nearest time option given a time string', ({ invalidTime, result }) => {
    const actual = getNearestTimeOption(invalidTime)
    expect(actual).toBe(result)
  })
})
