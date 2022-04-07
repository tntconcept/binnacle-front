import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { ActivitiesRepository } from 'modules/binnacle/data-access/repositories/activities-repository'
import { mock } from 'jest-mock-extended'
import { SubmitActivityFormAction } from 'modules/binnacle/data-access/actions/submit-activity-form-action'
import {
  buildOrganization,
  buildProject,
  mockProjectRole,
  mockRecentRole
} from 'test-utils/generateTestMocks'
import { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import type { ToastType } from '../../../../shared/data-access/ioc-container/ioc-container'

describe('SubmitActivityFormAction', () => {
  it('should create activity with image using project role', async () => {
    const { submitActivityFormAction, activitiesRepository, getCalendarDataAction } = setup()

    const value: {
      activityId: number | undefined
      activityDate: Date
      values: ActivityFormSchema
    } = {
      activityId: undefined,
      activityDate: new Date('2021-07-22'),
      values: {
        billable: false,
        description: 'Lorem ipsum...',
        startTime: '09:00',
        endTime: '10:00',
        imageBase64: 'image base64',
        organization: buildOrganization({ id: 1 }),
        project: buildProject({ id: 10 }),
        role: mockProjectRole({ id: 100 }),
        recentRole: undefined,
        showRecentRole: false
      }
    }

    await submitActivityFormAction.execute(value)

    expect(activitiesRepository.createActivity).toHaveBeenCalledWith({
      id: undefined,
      billable: false,
      description: 'Lorem ipsum...',
      startDate: new Date('2021-07-22T07:00:00.000Z'),
      duration: 60,
      hasImage: true,
      imageFile: 'image base64',
      projectRoleId: 100
    })
    expect(getCalendarDataAction.execute).toHaveBeenCalled()
  })

  it('should update activity without image using recent role', async () => {
    const { submitActivityFormAction, activitiesRepository, getCalendarDataAction } = setup()

    const value: {
      activityId: number | undefined
      activityDate: Date
      values: ActivityFormSchema
    } = {
      activityId: 1,
      activityDate: new Date('2021-07-22'),
      values: {
        billable: false,
        description: 'Lorem ipsum...',
        startTime: '14:00',
        endTime: '15:00',
        imageBase64: null,
        organization: undefined,
        project: undefined,
        role: undefined,
        recentRole: mockRecentRole({ id: 10 }),
        showRecentRole: true
      }
    }

    await submitActivityFormAction.execute(value)

    expect(activitiesRepository.updateActivity).toHaveBeenCalledWith({
      id: 1,
      billable: false,
      description: 'Lorem ipsum...',
      startDate: new Date('2021-07-22T12:00:00.000Z'),
      duration: 60,
      hasImage: false,
      imageFile: undefined,
      projectRoleId: 10
    })
    expect(getCalendarDataAction.execute).toHaveBeenCalled()
  })
})

function setup() {
  const activitiesRepository = mock<ActivitiesRepository>()
  const getCalendarDataAction = mock<GetCalendarDataAction>()
  const toast = jest.fn() as unknown as ToastType

  return {
    submitActivityFormAction: new SubmitActivityFormAction(
      activitiesRepository,
      getCalendarDataAction,
      toast
    ),
    activitiesRepository,
    getCalendarDataAction
  }
}
