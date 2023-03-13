import { HttpClient } from 'shared/data-access/http-client/http-client'
import { mock } from 'jest-mock-extended'
import endpoints from 'shared/api/endpoints'
import { Serialized } from 'shared/types/Serialized'
import { Holidays } from 'shared/types/Holidays'
import { HttpHolidaysRepository } from './http-holidays-repository'

describe('HttpHolidaysRepository', () => {
  it('should get holidays', async () => {
    const holidaysResponse: Serialized<Holidays> = {
      holidays: [{ date: '2021-02-02', description: '' }],
      vacations: [
        {
          id: 1,
          state: 'ACCEPT',
          startDate: '2021-02-03',
          endDate: '2021-02-04',
          days: ['2021-02-03', '2021-02-04'],
          chargeYear: '2021-01-01',
          description: undefined,
          observations: undefined
        }
      ]
    }
    const { holidaysRepository, httpClient } = setup()

    httpClient.get.mockResolvedValue(holidaysResponse)

    const startDate = new Date('2021-02-01')
    const endDate = new Date('2021-03-01')

    const result = await holidaysRepository.getHolidays(startDate, endDate)

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.holidays, {
      params: { endDate: '2021-03-01', startDate: '2021-02-01' }
    })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "holidays": Array [
          Object {
            "date": 2021-02-01T23:00:00.000Z,
            "description": "",
          },
        ],
        "vacations": Array [
          Object {
            "chargeYear": 2020-12-31T23:00:00.000Z,
            "days": Array [
              2021-02-02T23:00:00.000Z,
              2021-02-03T23:00:00.000Z,
            ],
            "description": undefined,
            "endDate": 2021-02-03T23:00:00.000Z,
            "id": 1,
            "observations": undefined,
            "startDate": 2021-02-02T23:00:00.000Z,
            "state": "ACCEPT",
          },
        ],
      }
    `)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    holidaysRepository: new HttpHolidaysRepository(httpClient)
  }
}
