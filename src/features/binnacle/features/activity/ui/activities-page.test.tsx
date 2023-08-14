import { describe, expect, it, Mock, vi } from 'vitest'
import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { act, render, screen, userEvent } from '../../../../../test-utils/render'
import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { ProjectRoleMother } from '../../../../../test-utils/mothers/project-role-mother'
import { UserSettingsMother } from '../../../../../test-utils/mothers/user-settings-mother'
import { Activity } from '../domain/activity'
import ActivitiesPage from './activities-page'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../../../shared/arch/hooks/use-execute-use-case-on-mount')
vi.mock('../../../../../shared/arch/hooks/use-get-use-case')

describe('ActivitiesPage', () => {
  it('should render correctly the activities', async () => {
    const activities = ActivityMother.activitiesPending()
    setup(activities)

    expect(await screen.findByText('actions.edit')).toBeInTheDocument()
    expect(await screen.findByText('actions.remove')).toBeInTheDocument()
  })

  it('should render correctly empty table', async () => {
    setup([])
    expect(await screen.findByText('activity.empty')).toBeInTheDocument()
  })

  it('should open new activity modal', async () => {
    setup([])
    userEvent.click(screen.getByTestId('show_activity_modal'))
    expect(await screen.findByText('activity_form.description')).toBeInTheDocument()
  })

  it('should open edit activity modal', async () => {
    const activities = ActivityMother.activitiesPending()
    setup(activities)
    act(() => {
      userEvent.click(screen.getByText('actions.edit'))
    })
    expect(await screen.findByText('activity_form.description'))
  })

  it('should open delete modal', async () => {
    const activities = ActivityMother.activitiesPending()
    setup(activities)
    act(() => {
      userEvent.click(screen.getByText('actions.remove'))
    })
    expect(await screen.findByText('activity_form.remove_activity')).toBeInTheDocument()
  })
})

function setup(activities: Activity[]) {
  const recentRoles = ProjectRoleMother.projectRoles()
  const settings = UserSettingsMother.userSettings()
  const approveActivityCmdMock = vi.fn()
  const deleteActivityCmdMock = vi.fn()
  const getActivityImageQryMock = vi.fn()
  const createActivityCmdMock = vi.fn()
  const updateActivityCmdMock = vi.fn()

  ;(useExecuteUseCaseOnMount as Mock).mockImplementation((arg) => {
    if (arg.prototype.key === 'GetActivitiesQry') {
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
  })
  ;(useGetUseCase as Mock).mockImplementation((arg) => {
    if (arg.prototype.key === 'ApproveActivityCmd') {
      return {
        useCase: approveActivityCmdMock
      }
    }
    if (arg.prototype.key === 'DeleteActivityCmd') {
      return {
        useCase: deleteActivityCmdMock
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
      return { isLoading: false, executeUseCase: vi.fn().mockResolvedValue([]) }
    }
    if (arg.prototype.key === 'GetDaysForActivityDaysPeriodQry') {
      return {
        isLoading: false,
        executeUseCase: vi.fn().mockResolvedValue(0)
      }
    }
    if (arg.prototype.key === 'GetDaysForActivityNaturalDaysPeriodQry') {
      return {
        isLoading: false,
        executeUseCase: vi.fn().mockResolvedValue(0)
      }
    }
  })

  render(
    <MemoryRouter>
      <ActivitiesPage />
    </MemoryRouter>
  )
}
