import { singleton } from 'tsyringe'
import { Activity } from '../activity'
import { ActivityWithUserName } from '../activity-with-user-name'
import { UserInfo } from '../../../../../user/domain/user-info'

@singleton()
export class ActivitiesWithUserName {
  addUserNameToActivities(
    activitiesWithoutUserName: Activity[],
    usersList: UserInfo[]
  ): ActivityWithUserName[] {
    return activitiesWithoutUserName.map((activityWithoutUserName) => {
      const { userId, ...activityDetails } = activityWithoutUserName

      const userName = usersList.find((user) => user.id === userId)

      return {
        ...activityDetails,
        userName: userName?.name || ''
      } as ActivityWithUserName
    })
  }
}
