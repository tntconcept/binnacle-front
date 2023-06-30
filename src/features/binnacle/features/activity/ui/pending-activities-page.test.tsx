import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { render, screen } from 'test-utils/app-test-utils'
import { ActivityMother } from 'test-utils/mothers/activity-mother'
import { ProjectRoleMother } from 'test-utils/mothers/project-role-mother'
import { UserSettingsMother } from 'test-utils/mothers/user-settings-mother'
import { Activity } from '../domain/activity'
import { PendingActivitiesPage } from './pending-activities-page'

jest.mock('../../../../../shared/arch/hooks/use-execute-use-case-on-mount')
jest.mock('../../../../../shared/arch/hooks/use-get-use-case')

describe('PendingActivitiesPage', () => {
  it('should render correctly the activities', async () => {
    const activities = ActivityMother.activitiesPending()
    setup(activities)

    expect(await screen.findByText('actions.show')).toBeInTheDocument()
  })
  it('should render correctly empty table', async () => {
    setup([])
    expect(await screen.findByText('activity_pending.empty')).toBeInTheDocument()
  })
})

function setup(activities: Activity[]) {
  const recentRoles = ProjectRoleMother.projectRoles()
  const settings = UserSettingsMother.userSettings()
  const approveActivityCmdMock = jest.fn()
  const getActivityImageQryMock = jest.fn()
  const createActivityCmdMock = jest.fn()
  const updateActivityCmdMock = jest.fn()

  ;(useExecuteUseCaseOnMount as jest.Mock).mockImplementation((arg) => {
    if (arg.prototype.key === 'GetPendingActivitiesQry') {
      return {
        isLoading: false,
        result: activities,
        executeUseCase: jest.fn().mockResolvedValue(activities)
      }
    }
    if (arg.prototype.key === 'GetRecentProjectRolesQry') {
      return { result: recentRoles }
    }
    if (arg.prototype.key === 'GetUserSettingsQry') {
      return { result: settings }
    }
    if (arg.prototype.key === 'GetOrganizationsQry') {
      return { isLoading: false }
    }
  })
  ;(useGetUseCase as jest.Mock).mockImplementation((arg) => {
    if (arg.prototype.key === 'ApproveActivityCmd') {
      return {
        useCase: approveActivityCmdMock
      }
    }
    if (arg.prototype.key === 'GetActivityEvidenceQry') {
      return {
        useCase: getActivityImageQryMock
      }
    }
    if (arg.prototype.key === 'CreateActivityCmd') {
      return {
        useCase: createActivityCmdMock
      }
    }
    if (arg.prototype.key === 'UpdateActivityCmd') {
      return {
        useCase: updateActivityCmdMock
      }
    }
    if (arg.prototype.key === 'GetProjectsQry') {
      return { isLoading: false }
    }
    if (arg.prototype.key === 'GetProjectRolesQry') {
      return { isLoading: false }
    }
    if (arg.prototype.key === 'GetDaysForActivityDaysPeriodQry') {
      return { isLoading: false }
    }
  })

  render(<PendingActivitiesPage />)
}
