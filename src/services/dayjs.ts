import dayjsLibrary from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjsLibrary.extend(isSameOrAfter)
dayjsLibrary.extend(utc)

// always utc, cast to local manually
const dayjs = dayjsLibrary.utc

export const DATE_FORMAT = 'YYYY-MM-DD'

export default dayjs
export { Dayjs } from 'dayjs'
