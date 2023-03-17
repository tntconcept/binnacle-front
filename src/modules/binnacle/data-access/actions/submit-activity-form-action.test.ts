import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { mock } from 'jest-mock-extended'
import { SubmitActivityFormAction } from 'modules/binnacle/data-access/actions/submit-activity-form-action'
import { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import type { ToastType } from '../../../../shared/data-access/ioc-container/ioc-container'
import { ActivityRepository } from '../interfaces/activity-repository'
import { ProjectMother } from 'test-utils/mothers/project-mother'
import { ProjectRoleMother } from 'test-utils/mothers/project-role-mother'
import { ActivityMother } from 'test-utils/mothers/activity-mother'
import { OrganizationMother } from 'test-utils/mothers/organization-mother'

describe('SubmitActivityFormAction', () => {
  it('should create activity with image using project role', async () => {
    const { submitActivityFormAction, activityRepository, getCalendarDataAction } = setup()

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
        start: '09:00',
        end: '10:00',
        imageBase64: 'image base64',
        organization: OrganizationMother.organization(),
        project: ProjectMother.billableProject(),
        role: ProjectRoleMother.projectRoleInMinutes(),
        recentRole: undefined,
        showRecentRole: false
      }
    }

    await submitActivityFormAction.execute(value)

    expect(activityRepository.createActivity).toHaveBeenCalledWith({
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
    const { submitActivityFormAction, activityRepository, getCalendarDataAction } = setup()

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
        start: '14:00',
        end: '15:00',
        imageBase64: null,
        organization: undefined,
        project: undefined,
        role: undefined,
        recentRole: ActivityMother.recentRoleInMinutes(),
        showRecentRole: true
      }
    }

    await submitActivityFormAction.execute(value)

    expect(activityRepository.updateActivity).toHaveBeenCalledWith({
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
  const activityRepository = mock<ActivityRepository>()
  const getCalendarDataAction = mock<GetCalendarDataAction>()
  const toast = jest.fn() as unknown as ToastType

  return {
    submitActivityFormAction: new SubmitActivityFormAction(
      activityRepository,
      getCalendarDataAction,
      toast
    ),
    activityRepository,
    getCalendarDataAction
  }
}
