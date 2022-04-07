import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { ActivitiesRepository } from 'modules/binnacle/data-access/repositories/activities-repository'
import { mock } from 'jest-mock-extended'
import { DeleteActivityAction } from 'modules/binnacle/data-access/actions/delete-activity-action'
import type { ToastType } from '../../../../shared/data-access/ioc-container/ioc-container'

describe('DeleteActivityAction', () => {
  it('should delete activity', async () => {
    const { deleteActivityAction, activitiesRepository, getCalendarDataAction } = setup()

    await deleteActivityAction.execute(1)

    expect(activitiesRepository.deleteActivity).toHaveBeenCalledWith(1)
    expect(getCalendarDataAction.execute).toHaveBeenCalled()
  })
})

function setup() {
  const activitiesRepository = mock<ActivitiesRepository>()
  const getCalendarDataAction = mock<GetCalendarDataAction>()
  const toast = jest.fn() as unknown as ToastType

  return {
    deleteActivityAction: new DeleteActivityAction(
      activitiesRepository,
      getCalendarDataAction,
      toast
    ),
    activitiesRepository,
    getCalendarDataAction
  }
}
