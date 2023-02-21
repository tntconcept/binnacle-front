export interface YearBalance {
  months: YearBalancePerMonth[]
  roles: YearBalanceRoles[]
}

export type LoggedTimeWithPercentage = {
  hours: number
  percentage: number
}

export type YearBalanceRoles = {
  roleId: number
  organization: string
  project: string
  role: string
  worked: number
  months: LoggedTimeWithPercentage[]
}

export interface YearBalancePerMonth {
  recommended: number
  worked: number
  balance: number
  vacations: LoggedTimeWithPercentage
  total: number
}
