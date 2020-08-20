import { rest } from 'msw'
import { res } from './res'
import { IHolidays, PrivateHolidayState } from 'api/interfaces/IHolidays'

interface VacationResource {
  id?: number
  userComment?: string
  beginDate: string
  finalDate: string
  chargeYear: string
}

function makeVacationDb() {
  const map = new Map<number, VacationResource>()

  return {
    findById: (id: number) => map.get(id),
    insert: (item: any) => map.set(item.id, item),
    create: (item: any) => {
      const newItem = { id: Date.now(), ...item }
      map.set(newItem.id, item)
      return newItem
    },
    update: (item: any) => {
      if (!map.has(item.id)) {
        throw new Error('id does not exist')
      }

      const currentItem = map.get(item.id)
      const newItem = { ...currentItem, ...item }
      map.set(item.id, newItem)

      return newItem
    },
    list: () => Array.from(map.values()),
    remove: (id: number) => map.delete(id)
  }
}

const vacationDb = makeVacationDb()

export const handlers = [
  rest.get('http://localhost:8080/api/holidays', (req, _, ctx) => {
    const startDate = req.url.searchParams.get('startDate')
    const endDate = req.url.searchParams.get('endDate')

    const vacation = vacationDb.list()

    const v = vacation.map((value) => {})

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

    return res(ctx.delay(1000), ctx.json(response))
  }),
  rest.post('http://localhost:8080/api/holidays', (req, _, ctx) => {
    const vacation = vacationDb.create(req.body)
    return res(ctx.delay(1000), ctx.json(vacation))
  }),
  rest.put('http://localhost:8080/api/holidays', (req, _, ctx) => {
    const vacation = vacationDb.update(req.body)
    return res(ctx.delay(1000), ctx.json(vacation))
  }),
  rest.delete('http://localhost:8080/api/holidays/:holidayId', (req, _, ctx) => {
    const { holidayId } = req.params
    vacationDb.remove(holidayId)
    return res(ctx.delay(1000), ctx.status(201))
  })
]
