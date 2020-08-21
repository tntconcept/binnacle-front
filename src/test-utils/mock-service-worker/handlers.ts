import { rest } from 'msw'
import { res } from './res'
import {
  IHolidays,
  IPrivateHoliday,
  PrivateHolidayState
} from 'api/interfaces/IHolidays'
import { eachDayOfInterval, isSameYear, parse } from 'date-fns'

interface VacationResource {
  id?: number
  userComment?: string
  beginDate: string
  finalDate: string
  chargeYear: string
}

function makeVacationDb() {
  const map = new Map<number, IPrivateHoliday & { id: number }>()

  return {
    findById: (id: number) => map.get(id),
    insert: (item: IPrivateHoliday & { id: number }) => map.set(item.id, item),
    create: (item: IPrivateHoliday & { id: number }) => {
      map.set(item.id, item)
      return item
    },
    update: (item: IPrivateHoliday & { id: number }) => {
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
vacationDb.insert({
  id: 1,
  days: [new Date()],
  state: PrivateHolidayState.Accept,
  observations: undefined,
  userComment: undefined
})

vacationDb.insert({
  id: 2,
  days: [new Date('2020-01-10'), new Date('2020-01-15')],
  state: PrivateHolidayState.Cancelled,
  observations: '8 Dias',
  userComment: 'Me voy de viaje'
})

vacationDb.insert({
  id: 3,
  days: [new Date('2020-10-08'), new Date('2020-10-20')],
  state: PrivateHolidayState.Pending,
  observations: '7 Días',
  userComment: 'Quiero vacaciones'
})

vacationDb.insert({
  id: 4,
  days: [new Date('2019-11-10')],
  state: PrivateHolidayState.Accept,
  observations: undefined,
  userComment: undefined
})

export const handlers = [
  rest.get('http://localhost:8080/api/holidays', (req, _, ctx) => {
    const startDate = req.url.searchParams.get('startDate')
    const endDate = req.url.searchParams.get('endDate')

    const filteredByYear = vacationDb
      .list()
      .filter((v) => v.days.some((date) => isSameYear(date, new Date(startDate!))))

    console.log(startDate)
    console.log(filteredByYear)

    const response: IHolidays = {
      publicHolidays: [],
      privateHolidays: filteredByYear
    }

    return res(ctx.delay(1000), ctx.json(response))
  }),
  rest.post('http://localhost:8080/api/holidays', (req, _, ctx) => {
    const vacationRequest = req.body as VacationResource
    const vacation = vacationDb.create({
      id: Date.now(),
      userComment: vacationRequest.userComment,
      days: eachDayOfInterval({
        start: parse(vacationRequest.beginDate, 'dd/MM/yyyy', new Date()),
        end: parse(vacationRequest.finalDate, 'dd/MM/yyyy', new Date())
      }),
      observations: '',
      state: PrivateHolidayState.Pending
    })
    return res(ctx.delay(1000), ctx.json(vacation))
  }),
  rest.put('http://localhost:8080/api/holidays', (req, _, ctx) => {
    const vacationRequest = req.body as VacationResource
    const vacation = vacationDb.update({
      id: vacationRequest.id,
      userComment: vacationRequest.userComment,
      days: eachDayOfInterval({
        start: parse(vacationRequest.beginDate, 'dd/MM/yyyy', new Date()),
        end: parse(vacationRequest.finalDate, 'dd/MM/yyyy', new Date())
      })
    } as any)
    return res(ctx.delay(1000), ctx.json(vacation))
  }),
  rest.delete('http://localhost:8080/api/holidays/:holidayId', (req, _, ctx) => {
    const { holidayId } = req.params
    vacationDb.remove(+holidayId)
    return res(ctx.delay(1000), ctx.status(201))
  })
]
