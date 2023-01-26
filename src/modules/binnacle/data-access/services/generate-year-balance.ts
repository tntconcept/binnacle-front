import { injectable } from 'tsyringe'
import { SearchRolesResponse } from '../interfaces/search-roles-response.interface'
import { WorkingTime } from '../interfaces/working-time.interface'
import {
  TimeWorkedWithPercentage,
  YearBalance,
  YearBalanceRoles,
  YearBalanceMonth
} from '../interfaces/year-balance.interface'

@injectable()
export class GenerateYearBalance {
  generate(workingTime: WorkingTime, searchRolesResponse: SearchRolesResponse): YearBalance {
    const months: YearBalanceMonth[] = this.getAnnualBalancePerMonth(workingTime)

    const roles: YearBalanceRoles[] = this.getAnnualBalancePerRole(workingTime, searchRolesResponse)

    return {
      months,
      roles
    }
  }

  protected getAnnualBalancePerMonth = (workingTime: WorkingTime): YearBalanceMonth[] => {
    return (
      workingTime.months.map(({ worked, recommended, balance }) => ({
        worked,
        recommended,
        balance
      })) ?? []
    )
  }

  protected getAnnualBalancePerRole = (
    workingTime: WorkingTime,
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
            worked: roleFounded.worked,
            percentage: (roleFounded.worked * 100) / month.worked
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
