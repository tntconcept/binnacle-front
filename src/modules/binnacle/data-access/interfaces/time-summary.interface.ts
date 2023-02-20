interface AnnualBalance {
  balance: number
  notRequestedVacations: number
  target: number
  worked: number
}

export interface MonthlyBalance {
  workable: number
  worked: number
  recommended: number
  balance: number
  vacations: number
  roles: MonthlyRolesBalance[]
}

interface MonthlyRolesBalance {
  id: number
  hours: number
}

interface YearAnnualBalance {
  current: AnnualBalance
}

export interface TimeSummary {
  year: YearAnnualBalance
  months: Array<MonthlyBalance>
}
