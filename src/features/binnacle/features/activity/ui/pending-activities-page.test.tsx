import { describe, expect, it, Mock, vi } from 'vitest'
import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { render, screen } from '../../../../../test-utils/render'
import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { ProjectRoleMother } from '../../../../../test-utils/mothers/project-role-mother'
import { UserSettingsMother } from '../../../../../test-utils/mothers/user-settings-mother'
import { Activity } from '../domain/activity'
import PendingActivitiesPage from './pending-activities-page'
import { UserMother } from '../../../../../test-utils/mothers/user-mother'

vi.mock('../../../../../shared/arch/hooks/use-execute-use-case-on-mount')
vi.mock('../../../../../shared/arch/hooks/use-get-use-case')

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
  const users = UserMother.userList()
  const approveActivityCmdMock = vi.fn()
  const getActivityImageQryMock = vi.fn()
  const createActivityCmdMock = vi.fn()
  const updateActivityCmdMock = vi.fn()

  ;(useExecuteUseCaseOnMount as Mock).mockImplementation((arg) => {
    if (arg.prototype.key === 'GetActivitiesByFiltersQry') {
      return {
        isLoading: false,
        result: activities,
        executeUseCase: vi.fn().mockResolvedValue(activities)
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
    if (arg.prototype.key === 'GetUsersListQry') {
      return {
        isLoading: false,
        result: users
      }
    }
  })
  ;(useGetUseCase as Mock).mockImplementation((arg) => {
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
