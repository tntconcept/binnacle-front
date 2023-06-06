import { parseISO } from 'shared/utils/chrono'
import { ProjectDto } from '../domain/project-dto'
import { Project } from '../domain/project'

export class ProjectMapper {
  static toDomain(projectDto: ProjectDto): Project {
    return {
      ...projectDto,
      startDate: projectDto.startDate !== null ? parseISO(projectDto.startDate) : null,
      blockDate: projectDto.blockDate !== null ? parseISO(projectDto.blockDate) : null
    }
  }

  static toDomainList(projectDto: ProjectDto[]): Project[] {
    return projectDto.map(this.toDomain)
  }
}
