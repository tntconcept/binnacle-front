interface AnnualBalance {
  worked: number
  targetWork: number
}

interface MonthlyBalance {
  worked: number
  recommendedWork: number
}

export interface WorkingTime {
  annualBalance: AnnualBalance
  monthlyBalances: Record<string, MonthlyBalance>
}
