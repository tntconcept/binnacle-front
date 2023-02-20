import { injectable } from 'tsyringe'
import { SearchRolesResponse } from '../interfaces/search-roles-response.interface'
import { TimeSummary } from '../interfaces/time-summary.interface'
import {
  LoggedTimeWithPercentage,
  YearBalance,
  YearBalancePerMonth,
  YearBalanceRoles
} from '../interfaces/year-balance.interface'

@injectable()
export class GenerateYearBalance {
  generate(workingTime: TimeSummary, searchRolesResponse: SearchRolesResponse): YearBalance {
    const months: YearBalancePerMonth[] = this.getAnnualBalancePerMonth(workingTime)

    const roles: YearBalanceRoles[] = this.getAnnualBalancePerRole(workingTime, searchRolesResponse)

    return {
      months,
      roles
    }
  }

  protected getAnnualBalancePerMonth = (workingTime: TimeSummary): YearBalancePerMonth[] => {
    return (
      workingTime.months.map(({ worked, recommended, balance, vacations }) => {
        const total = this.getTotalHoursLogged({ worked, vacations })
        return {
          worked,
          recommended,
          balance,
          vacations: {
            hours: vacations,
            percentage: total > 0 ? (vacations * 100) / total : 0
          },
          total
        }
      }) ?? []
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
      const months: LoggedTimeWithPercentage[] =
        workingTime.months.map((month) => {
          const roleFounded = month.roles.find((monthRole) => monthRole.id === roleId)
          if (!roleFounded) return { hours: 0, percentage: 0 }
          const total = this.getTotalHoursLogged({
            worked: month.worked,
            vacations: month.vacations
          })

          return {
            hours: roleFounded.hours,
            percentage: total > 0 ? (roleFounded.hours * 100) / total : 0
          }
        }) ?? []

      const worked = months.reduce((acc, m) => (acc += m.hours), 0)

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

  protected getTotalHoursLogged({
    worked,
    vacations
  }: {
    worked: number
    vacations: number
  }): number {
    return worked + vacations
  }
}
