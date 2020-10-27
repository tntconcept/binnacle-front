export interface CreateVacationPeriod {
  id?: number
  startDate: ISO8601Date
  endDate: ISO8601Date
  description?: string
}

export interface CreateVacationPeriodResponse {
  startDate: ISO8601Date
  endDate: ISO8601Date
  days: number
  chargeYear: number
}
