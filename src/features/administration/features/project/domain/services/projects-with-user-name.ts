import { singleton } from 'tsyringe'
import { UserInfo } from '../../../../../shared/user/domain/user-info'
import { Project } from '../../../../../shared/project/domain/project'

@singleton()
export class ProjectsWithUserName {
  addProjectBlockerUserName(projectsWithoutUserName: Project[], usersList: UserInfo[]): Project[] {
    return projectsWithoutUserName.map((projectWithoutUserName) => {
      const { blockedByUser, ...projectDetails } = projectWithoutUserName

      const userName = usersList.find((user) => user.id === blockedByUser)

      return {
        ...projectDetails,
        blockedByUserName: userName?.name || ''
      } as Project
    })
  }
}
