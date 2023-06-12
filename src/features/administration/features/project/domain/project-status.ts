import { Status } from './status'
import { Id } from '@archimedes/arch'

export interface ProjectStatus {
  id: Id
  value: boolean
  name: Status
}
