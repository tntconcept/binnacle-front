import { singleton } from 'tsyringe'
import { UserInfo } from '../../../../../shared/user/domain/user-info'
import { Activity } from '../activity'

@singleton()
export class ActivitiesWithApprovalUserName {
  addUserNameToActivitiesApproval(
    activitiesWithoutUserName: Activity[],
    usersList: UserInfo[]
  ): Activity[] {
    return activitiesWithoutUserName.map((activity) => {
      const userName = usersList.find((user) => user.id === activity.approval.approvedByUserId)

      return {
        ...activity,
        approval: {
          ...activity.approval,
          approvedByUserName: userName?.name ?? '-'
        }
      } as Activity
    })
  }
}
