import { Activity } from '../../../../../domain/activity'

export interface CellHeaderProps {
  date: Date
  time: number
  selectedMonth: Date
  activities: Activity[]
}
