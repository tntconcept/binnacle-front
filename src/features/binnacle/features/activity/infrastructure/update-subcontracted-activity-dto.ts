import { Serialized } from '../../../../../shared/types/serialized'
import { UpdateSubcontractedActivity } from '../domain/update-subcontracted-activity'

export type UpdateSubcontractedActivityDto = Omit<
  Serialized<UpdateSubcontractedActivity>,
  'evidence'
> & {
  evidence?: string
}
