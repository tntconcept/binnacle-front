import { Id } from 'shared/types/id'
import { NonHydratedProjectRole } from './non-hydrated-project-role'

export interface ProjectsIdByYear {
  projectId: Id
  year: number
}

export interface ProjectRoleRepository {
  getAll({ projectId, year }: ProjectsIdByYear): Promise<NonHydratedProjectRole[]>

  getRecents(year: number): Promise<NonHydratedProjectRole[]>
}
