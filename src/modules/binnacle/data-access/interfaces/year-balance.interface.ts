export interface YearBalance {
  months: YearBalanceMonth[]
  roles: YearBalanceRoles[]
}

export type TimeWorkedWithPercentage = {
  worked: number
  percentage: number
}

export type YearBalanceRoles = {
  roleId: number
  organization: string
  project: string
  role: string
  worked: number
  months: TimeWorkedWithPercentage[]
}

export interface YearBalanceMonth {
  recommended: number
  worked: number
  balance: number
}
