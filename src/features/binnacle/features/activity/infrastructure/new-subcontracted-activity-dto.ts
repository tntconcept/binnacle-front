import { Serialized } from '../../../../../shared/types/serialized'
import { NewSubcontractedActivity } from '../domain/new-subcontracted-activity'

export type NewSubcontractedActivityDto = Omit<
  Serialized<NewSubcontractedActivity>,
  'projectRoleId'
> & {
  projectRoleId?: number
}

//ASI ERA LA CLASE ANTES DE LOS CAMBIOS
//export type NewActivityDto = Omit<Serialized<NewActivity>, 'evidence'> & {
//    evidence?: string
//  }
