import { singleton } from 'tsyringe'
import { UserInfo } from '../../../../../shared/user/domain/user-info'
import { Project } from '../project'

@singleton()
export class ProjectsWithUserName {
  addUserNameToProjects(projectsWithoutUserName: Project[], usersList: UserInfo[]): Project[] {
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
