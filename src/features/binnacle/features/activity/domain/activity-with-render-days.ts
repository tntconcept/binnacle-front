import { Activity } from './activity'

export type ActivityWithRenderDays = Activity & {
  renderIndex: number
  renderDays: number
}
