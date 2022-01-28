export interface VacationPeriodResponse {
  startDate: string
  endDate: string
  days: number
  chargeYear: number
}

export interface VacationPeriodRequest {
  id?: number
  startDate: string
  endDate: string
  description?: string
}
