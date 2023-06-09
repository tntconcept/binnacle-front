import { singleton } from 'tsyringe'
import { UserInfo } from '../../../../../shared/user/domain/user-info'
import { Activity } from '../activity'

@singleton()
export class ActivitiesWithUserName {
  addUserNameToActivities(
    activitiesWithoutUserName: Activity[],
    usersList: UserInfo[]
  ): Activity[] {
    return activitiesWithoutUserName.map((activityWithoutUserName) => {
      const { userId, ...activityDetails } = activityWithoutUserName

      const userName = usersList.find((user) => user.id === userId)

      return {
        ...activityDetails,
        userName: userName?.name || ''
      } as Activity
    })
  }
}
