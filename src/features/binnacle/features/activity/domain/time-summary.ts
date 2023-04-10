import { Hours } from 'shared/types/hours'
import { Id } from 'shared/types/id'

interface AnnualBalance {
  balance: Hours
  notRequestedVacations: Hours
  target: Hours
  worked: Hours
}

export interface MonthlyBalance {
  workable: Hours
  worked: Hours
  recommended: Hours
  balance: Hours
  vacation: Hours
  roles: MonthlyRolesBalance[]
}

interface MonthlyRolesBalance {
  id: Id
  hours: Hours
}

interface YearAnnualBalance {
  current: AnnualBalance
}

export interface TimeSummary {
  year: YearAnnualBalance
  months: Array<MonthlyBalance>
}
