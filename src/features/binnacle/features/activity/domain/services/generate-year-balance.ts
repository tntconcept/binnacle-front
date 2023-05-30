import { SearchProjectRolesResult } from 'features/binnacle/features/search/domain/search-project-roles-result'
import { injectable } from 'tsyringe'
import { TimeSummary } from '../time-summary'
import {
  LoggedTimeWithPercentage,
  YearBalance,
  YearBalancePerMonth,
  YearBalanceRoles
} from '../year-balance'

@injectable()
export class GenerateYearBalance {
  generate(workingTime: TimeSummary, searchRolesResponse: SearchProjectRolesResult): YearBalance {
    const months: YearBalancePerMonth[] = this.getAnnualBalancePerMonth(workingTime)

    const roles: YearBalanceRoles[] = this.getAnnualBalancePerRole(workingTime, searchRolesResponse)

    return {
      months,
      roles
    }
  }

  protected getAnnualBalancePerMonth = (timeSummary: TimeSummary): YearBalancePerMonth[] => {
    return (
      timeSummary.months.map(({ worked, recommended, balance, vacations }) => {
        const enjoyed = vacations.enjoyed
        const total = this.getTotalHoursLogged({ worked, enjoyed })
        return {
          worked,
          recommended,
          balance,
          vacations: {
            hours: vacations.enjoyed ?? 0,
            percentage: total > 0 ? (vacations.enjoyed * 100) / total : 0
          },
          total
        }
      }) ?? []
    )
  }

  protected getAnnualBalancePerRole = (
    timeSummary: TimeSummary,
    searchRolesResponse: SearchProjectRolesResult
  ): YearBalanceRoles[] => {
    return searchRolesResponse.projectRoles.map((projectRole) => {
      const { id: roleId, name: role, projectId } = projectRole
      const project = searchRolesResponse.projects.find((p) => p.id === projectId)
      const organization = searchRolesResponse.organizations.find(
        (o) => o.id === project?.organizationId
      )
      const months: LoggedTimeWithPercentage[] =
        timeSummary.months.map((month) => {
          const roleFounded = month.roles.find((monthRole) => monthRole.id === roleId)
          if (!roleFounded) return { hours: 0, percentage: 0 }
          const monthEnjoyed = month.vacations.enjoyed
          const total = this.getTotalHoursLogged({
            worked: month.worked,
            enjoyed: monthEnjoyed
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
    worked = 0,
    enjoyed = 0
  }: {
    worked: number
    enjoyed: number
  }): number {
    return worked + enjoyed
  }
}
