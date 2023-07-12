import { Activity } from '../../../../../domain/activity'

export interface LeisureProps {
  date: Date
  time: number
  selectedMonth: Date
  activities: Activity[]
}
