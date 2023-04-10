import { Activity } from 'features/binnacle/features/activity/domain/activity'

export type ActivityWithRenderDays = Activity & {
  renderIndex: number
  renderDays: number
}
