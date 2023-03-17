import { RecentRole } from 'modules/binnacle/data-access/interfaces/recent-role'
import chrono from 'shared/utils/chrono'
import { last } from 'shared/utils/helpers'
import { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'

export class GetRecentRole {
  constructor(
    private date: Date,
    private selectedActivityRoleId: number | undefined,
    private recentRoles: RecentRole[],
    private activities: Activity[]
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
    return this.recentRoles ? this.recentRoles.at(0)?.id : undefined
  }

  private getLastImputedRole = () => {
    const imputedActivities = this.activities.filter(
      (a) =>
        chrono(a.interval.start).isBefore(this.date) ||
        chrono(a.interval.start).isSame(this.date, 'day')
    )
    const lastImputedActivity = last(imputedActivities)

    if (lastImputedActivity) {
      return lastImputedActivity?.projectRole.id
    }

    return undefined
  }
}
