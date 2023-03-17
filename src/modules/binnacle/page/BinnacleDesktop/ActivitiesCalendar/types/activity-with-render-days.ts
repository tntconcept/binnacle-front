import { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'

export type ActivityWithRenderDays = Activity & {
  renderIndex: number
  renderDays: number
}
