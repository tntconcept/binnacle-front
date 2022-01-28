import { action, makeObservable } from 'mobx'
import { ActivityFormState } from 'modules/binnacle/data-access/state/activity-form-state'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import chrono from 'shared/utils/chrono'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class OpenCreateActivityFormAction implements IAction<Date> {
  constructor(private activityFormState: ActivityFormState, private binnacleState: BinnacleState) {
    makeObservable(this)
  }

  @action
  async execute(selectedDate?: Date): Promise<void> {
    if (selectedDate) {
      this.activityFormState.selectedActivityDate = selectedDate
    }

    this.activityFormState.activity = undefined
    this.activityFormState.lastEndTime = this.getLastEndTime(selectedDate)
    this.activityFormState.isModalOpen = true
  }

  private getLastEndTime(selectedDate?: Date) {
    const dateToCompare = selectedDate ?? this.activityFormState.selectedActivityDate
    const day = this.binnacleState.activities.find((activityDay) =>
      chrono(activityDay.date).isSame(dateToCompare, 'day')
    )
    const lastActivity = day && day.activities[day.activities.length - 1]

    return lastActivity
      ? chrono(lastActivity.startDate)
        .plus(lastActivity.duration, 'minute')
        .getDate()
      : undefined
  }
}
