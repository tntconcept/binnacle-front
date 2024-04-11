import { Serialized } from '../../../../../shared/types/serialized'
import { UpdateSubcontractedActivity } from '../domain/update-subcontracted-activity'

export type UpdateSubcontractedActivityDto = Omit<
  Serialized<UpdateSubcontractedActivity>,
  'evidence'
> & {
  evidence?: string
}

/* import { Serialized } from '../../../../../shared/types/serialized'
import { UpdateActivity } from '../domain/update-activity'

export type UpdateActivityDto = Omit<Serialized<UpdateActivity>, 'evidence'> & {
  evidence?: string
} */
