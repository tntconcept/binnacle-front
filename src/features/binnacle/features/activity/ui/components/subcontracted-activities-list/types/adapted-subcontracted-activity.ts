import { SubcontractedActivity } from '../../../../domain/subcontracted-activity'

export interface AdaptedSubcontractedActivity {
  key: number
  id: number
  month: string
  duration: string | number
  organization: string
  project: string
  role: string
  action: SubcontractedActivity
}
