import { Hours } from '../../../../../shared/types/hours'
import { Id } from '../../../../../shared/types/id'

export interface YearBalance {
  months: YearBalancePerMonth[]
  roles: YearBalanceRoles[]
}

export type LoggedTimeWithPercentage = {
  hours: Hours
  percentage: number
}

export type YearBalanceRoles = {
  roleId: Id
  organization: string
  project: string
  role: string
  worked: Hours
  months: LoggedTimeWithPercentage[]
}

export interface YearBalancePerMonth {
  recommended: Hours
  worked: Hours
  balance: Hours
  vacations: LoggedTimeWithPercentage
  total: Hours
}
