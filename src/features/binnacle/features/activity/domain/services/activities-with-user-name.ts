import { singleton } from 'tsyringe'
import { Activity } from '../activity'
import { UserInfo } from '../../../../../user/domain/user-info'

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
