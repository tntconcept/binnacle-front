import { SubcontractedActivity } from '../../../../domain/subcontracted-activity'

export interface AdaptedSubcontractedActivity {
  key: number
  id: number
  billable: boolean
  month: string
  duration: string
  organization: string
  project: string
  role: string
  action: SubcontractedActivity
}
