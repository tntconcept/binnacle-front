export type VacationStatus = 'ACCEPT' | 'REJECT' | 'PENDING' | 'CANCELLED'

export interface Vacation {
  id: number
  observations?: string
  description?: string
  state: VacationStatus
  startDate: Date
  endDate: Date
  days: Date[]
  chargeYear: Date
}
