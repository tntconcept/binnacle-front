import { Serialized } from 'shared/types/serialized'
import { UpdateActivity } from '../domain/update-activity'

export type UpdateActivityDto = Omit<Serialized<UpdateActivity>, 'evidence'> & {
  evidence?: string
}
