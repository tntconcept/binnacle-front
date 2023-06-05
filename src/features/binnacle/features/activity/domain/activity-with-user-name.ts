import { Activity } from 'features/binnacle/features/activity/domain/activity'

export type ActivityWithUserName = Activity & {
  userName: string
}
