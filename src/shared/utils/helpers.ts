import { parse } from 'shared/utils/chrono'

type ClassName = string | false | void | null | 0
export const cls = (...classNames: ClassName[]) => classNames.filter(Boolean).join(' ')

export const last = <T>(arr: T[] | undefined) => {
  return arr && arr.length ? arr[arr.length - 1] : undefined
}
const getUTCDate = (dateString = Date.now()) => {
  const date = new Date(dateString)

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}
export const timeToDate = (time: string, backupDate?: Date) => {
  return parse(time, 'HH:mm', backupDate ?? getUTCDate())
}
