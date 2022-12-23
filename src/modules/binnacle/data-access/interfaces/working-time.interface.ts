interface AnnualBalance {
  balance: number
  notRequestedVacations: number
  target: number
  worked: number
}

interface MonthlyBalance {
  workable: number
  worked: number
  recommended: number
}

interface YearAnnualBalance {
  current: AnnualBalance
}

export interface WorkingTime {
  year: YearAnnualBalance
  months: Array<MonthlyBalance>
}
