import { Id } from '../../../../../shared/types/id'
import { Project } from './project'

export interface ProjectRepository {
  getAll(organizationId: Id): Promise<Project[]>
}
