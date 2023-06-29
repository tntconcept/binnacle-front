import { getTimeInterval } from './get-time-interval'

test('should format activity time range', function () {
  const date = new Date('2020-01-31T20:10:00.000Z')
  const result = getTimeInterval(date, 2 * 60)
  expect(result).toEqual('21:10 - 23:10')
})
