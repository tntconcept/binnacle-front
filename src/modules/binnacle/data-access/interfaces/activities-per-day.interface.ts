import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface';

export interface ActivitiesPerDay {
  date: Date
  workedMinutes: number
  activities: Activity[]
}
