import { action, makeObservable } from 'mobx'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { ActivitiesRepository } from 'modules/binnacle/data-access/repositories/activities-repository'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class DeleteActivityAction implements IAction<number> {
  constructor(
    private activitiesRepository: ActivitiesRepository,
    private getCalendarDataAction: GetCalendarDataAction
  ) {
    makeObservable(this)
  }

  @action
  async execute(activityId: number): Promise<void> {
    await this.activitiesRepository.deleteActivity(activityId)
    await this.getCalendarDataAction.execute()
  }
}
