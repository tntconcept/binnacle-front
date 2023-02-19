import { injectable } from 'tsyringe'
import { SearchRolesResponse } from '../interfaces/search-roles-response.interface'
import { TimeSummary } from '../interfaces/time-summary.interface'
import {
  TimeWorkedWithPercentage,
  YearBalance,
  YearBalanceRoles,
  YearBalanceMonth
} from '../interfaces/year-balance.interface'

@injectable()
export class GenerateYearBalance {
  generate(workingTime: TimeSummary, searchRolesResponse: SearchRolesResponse): YearBalance {
    const months: YearBalanceMonth[] = this.getAnnualBalancePerMonth(workingTime)

    const roles: YearBalanceRoles[] = this.getAnnualBalancePerRole(workingTime, searchRolesResponse)

    return {
      months,
      roles
    }
  }

  protected getAnnualBalancePerMonth = (workingTime: TimeSummary): YearBalanceMonth[] => {
    return (
      workingTime.months.map(({ worked, recommended, balance, vacations }) => ({
        worked,
        recommended,
        balance,
        vacations
      })) ?? []
    )
  }

  protected getAnnualBalancePerRole = (
    workingTime: TimeSummary,
    searchRolesResponse: SearchRolesResponse
  ): YearBalanceRoles[] => {
    return searchRolesResponse.projectRoles.map((projectRole) => {
      const { id: roleId, name: role, projectId } = projectRole
      const project = searchRolesResponse.projects.find((p) => p.id === projectId)
      const organization = searchRolesResponse.organizations.find(
        (o) => o.id === project?.organizationId
      )
      const months: TimeWorkedWithPercentage[] =
        workingTime.months.map((month) => {
          const roleFounded = month.roles.find((monthRole) => monthRole.id === roleId)
          if (!roleFounded) return { worked: 0, percentage: 0 }

          return {
            worked: roleFounded.hours,
            percentage: (roleFounded.hours * 100) / month.worked
          }
        }) ?? []

      const worked = months.reduce((acc, m) => (acc += m.worked), 0)

      return {
        roleId,
        role,
        months,
        worked,
        project: project?.name ?? '',
        organization: organization?.name ?? ''
      }
    })
  }
}
