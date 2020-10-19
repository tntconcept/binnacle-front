import HttpClient from 'services/HttpClient'

export async function fetchCorrespondingPrivateHolidayDays(
  startDate: ISO8601Date,
  endDate: ISO8601Date
): Promise<Number> {
  return await HttpClient.get('api/vacations/days', {
    searchParams: {
      startDate: startDate,
      endDate: endDate
    }
  }).json<number>()
}
