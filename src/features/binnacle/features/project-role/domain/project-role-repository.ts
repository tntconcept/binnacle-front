import { Id } from 'shared/types/id'
import { NonHydratedProjectRole } from './non-hydrated-project-role'

export interface ProjectRoleRepository {
  getAll(projectId: Id): Promise<NonHydratedProjectRole[]>

  getRecents(year: number): Promise<NonHydratedProjectRole[]>
}
