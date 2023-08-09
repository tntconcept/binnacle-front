import { Id } from '../../../../../shared/types/id'
import { NonHydratedProjectRole } from './non-hydrated-project-role'

export interface ProjectsIdByYear {
  projectId: Id
  year: number
  userId?: Id
}

export interface ProjectRoleRepository {
  getAll({ projectId, year, userId }: ProjectsIdByYear): Promise<NonHydratedProjectRole[]>
  getRecents(year: number): Promise<NonHydratedProjectRole[]>
}
