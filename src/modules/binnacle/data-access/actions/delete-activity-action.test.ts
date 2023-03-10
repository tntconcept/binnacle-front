import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { mock } from 'jest-mock-extended'
import { DeleteActivityAction } from 'modules/binnacle/data-access/actions/delete-activity-action'
import type { ToastType } from '../../../../shared/data-access/ioc-container/ioc-container'
import { ActivityRepository } from '../interfaces/activity-repository'

describe('DeleteActivityAction', () => {
  it('should delete activity', async () => {
    const { deleteActivityAction, activityRepository, getCalendarDataAction } = setup()

    await deleteActivityAction.execute(1)

    expect(activityRepository.deleteActivity).toHaveBeenCalledWith(1)
    expect(getCalendarDataAction.execute).toHaveBeenCalled()
  })
})

function setup() {
  const activityRepository = mock<ActivityRepository>()
  const getCalendarDataAction = mock<GetCalendarDataAction>()
  const toast = jest.fn() as unknown as ToastType

  return {
    deleteActivityAction: new DeleteActivityAction(
      activityRepository,
      getCalendarDataAction,
      toast
    ),
    activityRepository,
    getCalendarDataAction
  }
}
