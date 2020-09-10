export interface PrivateHolidayRequestBody {
  id?: number
  userComment?: string
  beginDate: ISO8601Date
  finalDate: ISO8601Date
  chargeYear: ISO8601Date
}
