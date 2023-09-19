import { singleton } from 'tsyringe'
import { Project } from '../project'
import { UserInfo } from '../../../user/domain/user-info'

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
