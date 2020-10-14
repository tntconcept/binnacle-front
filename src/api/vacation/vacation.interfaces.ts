export interface PrivateHolidayRequestBody {
  id?: number
  userComment?: string
  beginDate: ISO8601Date
  finalDate: ISO8601Date
  chargeYear: ISO8601Date
}

export interface CreatePrivateHolidayPeriod {
  id?: number
  startDate: ISO8601Date
  endDate: ISO8601Date
  description?: string
}

export interface CreatePrivateHolidayResponse {
  startDate: ISO8601Date
  endDate: ISO8601Date
  days: number
  chargeYear: number
}
