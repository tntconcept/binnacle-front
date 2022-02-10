interface AnnualBalance {
  worked: number
  targetWork: number
}

interface MonthlyBalance {
  worked: number
  recommendedWork: number
}

export interface WorkingBalance {
  annualBalance: AnnualBalance
  monthlyBalances: Record<string, MonthlyBalance>
}
