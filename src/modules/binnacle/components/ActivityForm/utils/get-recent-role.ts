import { RecentRole } from 'modules/binnacle/data-access/interfaces/recent-role'
import { ActivitiesPerDay } from 'modules/binnacle/data-access/interfaces/activities-per-day.interface'
import chrono from 'shared/utils/chrono'
import { last } from 'shared/utils/helpers'

export class GetRecentRole {
  constructor(
    private date: Date,
    private selectedActivityRoleId: number | undefined,
    private recentRoles: RecentRole[],
    private activities: ActivitiesPerDay[]
  ) {}

  getRole = () => {
    return this.findRole() ?? undefined
  }

  private findRole = () => {
    const hasRecentRoles = this.recentRoles && this.recentRoles.length
    if (hasRecentRoles) {
      const roleId =
        this.selectedActivityRoleId || this.getLastImputedRole() || this.getMostRecentRole()
      return this.recentRoles.find((r) => r.id === roleId) ?? this.recentRoles[0]
    }
  }

  private getMostRecentRole = () => {
    return this.recentRoles && this.recentRoles.length ? this.recentRoles[0].id : undefined
  }

  private getLastImputedRole = () => {
    const imputedDays = this.activities.filter(
      (a) =>
        a.activities.length > 0 &&
        (chrono(a.date).isBefore(this.date) || chrono(a.date).isSame(this.date, 'day'))
    )
    const lastImputedDay = last(imputedDays)

    if (lastImputedDay) {
      const lastActivity = last(lastImputedDay.activities)
      return lastActivity?.projectRole.id
    }

    return undefined
  }
}
