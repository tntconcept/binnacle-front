import { Id } from '@archimedes/arch'

export interface User {
  hiringDate: Date
  username?: string
  roles?: string[]
  id: Id
}
