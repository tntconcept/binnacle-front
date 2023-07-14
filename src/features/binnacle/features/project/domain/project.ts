import { Id } from '../../../../../shared/types/id'

export interface Project {
  id: Id
  name: string
  billable: boolean
  open: boolean
}
