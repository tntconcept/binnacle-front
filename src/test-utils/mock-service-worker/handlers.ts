import { rest } from 'msw'
import { res } from './res'
import { IHolidays, PrivateHolidayState } from 'api/interfaces/IHolidays'

export const handlers = [
  rest.get('http://localhost:8080/api/holidays', (req, _, ctx) => {
    const startDate = req.url.searchParams.get('startDate')
    const endDate = req.url.searchParams.get('endDate')

    const response: IHolidays = {
      publicHolidays: [],
      privateHolidays: [
        {
          days: [new Date('2020-01-01')],
          state: PrivateHolidayState.Accept,
          observations: undefined,
          userComment: undefined
        },
        {
          days: [new Date('2020-01-10'), new Date('2020-01-15')],
          state: PrivateHolidayState.Cancelled,
          observations: '8 Dias',
          userComment: 'Me voy de viaje'
        },
        {
          days: [new Date('2020-10-08'), new Date('2020-10-20')],
          state: PrivateHolidayState.Pending,
          observations: '7 Días',
          userComment: 'Quiero vacaciones'
        }
      ]
    }

    return res(ctx.json(response))
  })
]
