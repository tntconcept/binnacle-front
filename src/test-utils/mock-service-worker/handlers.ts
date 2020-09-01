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
  days: [new Date('2020-06-01'), new Date('2020-06-05')],
  state: PrivateHolidayState.Accept,
  observations: undefined,
  userComment: undefined,
  chargeYear: new Date('2020-01-01')
})

vacationDb.insert({
  id: 2,
  days: [new Date('2020-08-23'), new Date('2020-08-25')],
  state: PrivateHolidayState.Cancelled,
  observations: '2 días',
  userComment: 'Me voy de viaje',
  chargeYear: new Date('2020-01-01')
})

vacationDb.insert({
  id: 3,
  days: [new Date('2020-09-18')],
  state: PrivateHolidayState.Pending,
  observations: undefined,
  userComment: undefined,
  chargeYear: new Date('2020-01-01')
})

export const handlers = [
  // rest.post('http://localhost:8080/oauth/token', (req, _ , ctx) => {
  //   return res(
  //     ctx.delay(),
  //     ctx.json({
  //       access_token: "fake access token",
  //       token_type: 'bearer',
  //       refresh_token: "fake refresh token",
  //       expires_in: 123012312,
  //       scope:"fakse scope",
  //       jti: "fake jti"
  //     })
  //   )
  // }),
  // rest.get('http://localhost:8080/api/activities', (req, _, ctx) => {
  //   return res(
  //     ctx.delay(),
  //     ctx.json(Array(30).fill(null).map(v => ({
  //       date: new Date('2020-08-01'),
  //       workedMinutes: 0,
  //       activities: []
  //     })))
  //   )
  // }),
  // rest.get('http://localhost:8080/api/projectRoles/recents', (req, _, ctx) => {
  //   return res(
  //     ctx.delay(),
  //     ctx.json([])
  //   )
  // }),
  // rest.get('http://localhost:8080/api/timeBalance', (req, _, ctx) => {

  //   const year = new Date().getFullYear.toString()
  //   const result = {
  //     "2020-07-01": {
  //       timeToWork: 60 * 60 * 60,
  //       timeWorked: 60 * 60 * 8,
  //       timeDifference: 60 * 60 * 60 - 60 * 60 * 8
  //     },
  //     "2020-08-01": {
  //       timeToWork: 60 * 60 * 60,
  //       timeWorked: 60 * 60 * 8,
  //       timeDifference: 60 * 60 * 60 - 60 * 60 * 8
  //     },
  //     "2020-09-01": {
  //       timeToWork: 60 * 60 * 60,
  //       timeWorked: 60 * 60 * 8,
  //       timeDifference: 60 * 60 * 60 - 60 * 60 * 8
  //     }
  //   }

  //   console.log(result)

  //   return res(
  //     ctx.delay(),
  //     ctx.json(result)
  //   )
  // }),
  rest.get('http://localhost:8080/api/user', (req, _, ctx) => {
    return res(
      ctx.delay(),
      ctx.json({
        name: 'John Doe',
        hiringDate: '2018-01-01'
      })
    )
  }),
  rest.get('http://localhost:8080/api/vacation', (req, _, ctx) => {
    const year = req.url.searchParams.get('year')

    return res(
      ctx.delay(),
      ctx.json({
        vacationQtAgreement: 22,
        vacationSinceEntryDate: 11,
        acceptedVacationQt: 11,
        pendingVacationQt: 11
      })
    )
  }),
  rest.get('http://localhost:8080/api/holidays', (req, _, ctx) => {
    const startDate = req.url.searchParams.get('startDate')
    const endDate = req.url.searchParams.get('endDate')

    const filteredByYear = vacationDb
      .list()
      .filter(
        (v) => v.chargeYear.getUTCFullYear() == new Date(startDate!).getUTCFullYear()
      )

    const response: IHolidays = {
      publicHolidays: [],
      privateHolidays: filteredByYear
    }

    return res(ctx.delay(), ctx.json(response))
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
      state: PrivateHolidayState.Pending,
      chargeYear: parse(vacationRequest.chargeYear, 'yyyy', new Date())
    })

    return res(ctx.delay(), ctx.json(vacation))
  }),
  rest.put('http://localhost:8080/api/holidays', (req, _, ctx) => {
    const vacationRequest = req.body as VacationResource
    const vacation = vacationDb.update({
      id: vacationRequest.id,
      userComment: vacationRequest.userComment,
      days: eachDayOfInterval({
        start: parse(vacationRequest.beginDate, 'dd/MM/yyyy', new Date()),
        end: parse(vacationRequest.finalDate, 'dd/MM/yyyy', new Date())
      }),
      chargeYear: parse(vacationRequest.chargeYear, 'yyyy', new Date())
    } as any)
    return res(ctx.delay(), ctx.json(vacation))
  }),
  rest.delete('http://localhost:8080/api/holidays/:holidayId', (req, _, ctx) => {
    const { holidayId } = req.params
    vacationDb.remove(+holidayId)
    return res(ctx.delay(), ctx.status(201))
  })
]
