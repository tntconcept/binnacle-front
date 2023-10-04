import { Id } from '../../../../shared/types/id'

export interface UserFilters {
  ids?: Id[]
  active?: boolean
  nameLike?: string
  limit?: number
}
