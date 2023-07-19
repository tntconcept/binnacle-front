import { Serialized } from '../../../../../shared/types/serialized'
import { NewActivity } from '../domain/new-activity'

export type NewActivityDto = Omit<Serialized<NewActivity>, 'evidence'> & {
  evidence?: string
}
