import chrono from 'shared/utils/chrono'
import { UserSettings } from '../../../../../../../shared/user/features/settings/domain/user-settings'
import { GetAutofillHours } from './get-autofill-hours'

describe('GetAutofillHours', () => {
  it('should round minute to 15', function () {
    const result1 = GetAutofillHours.roundHourToQuarters(new Date('2020-01-31T20:10:00.000Z'))
    expect(result1).toEqual(new Date('2020-01-31T20:15:00.000Z'))

    const result2 = GetAutofillHours.roundHourToQuarters(new Date('2020-01-31T20:05:00.000Z'))
    expect(result2).toEqual(new Date('2020-01-31T20:00:00.000Z'))

    const result3 = GetAutofillHours.roundHourToQuarters(new Date('2020-01-31T20:00:00.000Z'))
    expect(result3).toEqual(new Date('2020-01-31T20:00:00.000Z'))

    const result4 = GetAutofillHours.roundHourToQuarters(new Date('2020-01-31T20:15:00.000Z'))
    expect(result4).toEqual(new Date('2020-01-31T20:15:00.000Z'))
  })

  const hoursIntervalMock = {
    startWorkingTime: '09:00',
    startLunchBreak: '13:00',
    endLunchBreak: '14:00',
    endWorkingTime: '18:00'
  }

  // last end time, expected start time, expected end time
  const cases = [
    ['08:00', '09:00', '13:00'],
    [undefined, '09:00', '13:00'],
    ['11:00', '11:00', '13:00'],
    ['13:00', '14:00', '18:00'],
    ['13:30', '14:00', '18:00'],
    ['13:45', '14:00', '18:00'],
    ['14:00', '14:00', '18:00'],
    ['15:00', '15:00', '18:00'],
    ['18:00', '18:00', '19:00'],
    ['20:00', '20:00', '21:00']
  ] as const

  test.each(cases)(
    'given %p as lastEndTime, returns %p - %p interval',
    (lastEndTime, startTime, endTime) => {
      const lastTimeImputed = lastEndTime ? new Date(`10-10-2010 ${lastEndTime}`) : undefined
      const { result } = setup(true, hoursIntervalMock, lastTimeImputed)

      expect(result).toEqual({
        startTime: startTime,
        endTime: endTime
      })
    }
  )

  it('should add 1 hour to current time if autofill is disabled', function () {
    chrono.now = jest.fn(() => new Date(`2020-09-09T10:07:00`))
    const { result } = setup(false, hoursIntervalMock, undefined)

    expect(result).toEqual({
      startTime: '10:00',
      endTime: '11:00'
    })
  })
})

function setup(
  autoFillHours: boolean,
  hoursInterval: UserSettings['hoursInterval'],
  previousEndTime: Date | undefined = undefined
) {
  const { getAutoFillHours } = new GetAutofillHours(autoFillHours, hoursInterval, previousEndTime)

  return {
    result: getAutoFillHours()
  }
}
