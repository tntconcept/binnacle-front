import { Activity } from '../../../../../domain/activity'

export interface HeaderProps {
  date: Date
  time: number
  selectedMonth: Date
  activities: Activity[]
}
