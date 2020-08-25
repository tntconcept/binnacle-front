import { last } from "utils/helpers";

export function formatVacationPeriod(days: Date[]) {
  return `${days[0].toLocaleDateString()} - ${last(
    days
  )!.toLocaleDateString()}`
}
