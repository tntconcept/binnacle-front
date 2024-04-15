import { Serialized } from '../../../../../shared/types/serialized'
import { NewSubcontractedActivity } from '../domain/new-subcontracted-activity'

export type NewSubcontractedActivityDto = Omit<
  Serialized<NewSubcontractedActivity>,
  'projectRoleId'
> & {
  projectRoleId?: number
}
