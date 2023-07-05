import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { render, screen, userEvent } from 'test-utils/app-test-utils'
import { ActivityMother } from 'test-utils/mothers/activity-mother'
import { ProjectRoleMother } from 'test-utils/mothers/project-role-mother'
import { UserSettingsMother } from 'test-utils/mothers/user-settings-mother'
import { Activity } from '../domain/activity'
import { ActivitiesPage } from './activities-page'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../../../../../shared/arch/hooks/use-execute-use-case-on-mount')
jest.mock('../../../../../shared/arch/hooks/use-get-use-case')

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
  const approveActivityCmdMock = jest.fn()
  const deleteActivityCmdMock = jest.fn()
  const getActivityImageQryMock = jest.fn()
  const createActivityCmdMock = jest.fn()
  const updateActivityCmdMock = jest.fn()

  ;(useExecuteUseCaseOnMount as jest.Mock).mockImplementation((arg) => {
    if (arg.prototype.key === 'GetActivitiesQry') {
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
      return { isLoading: false }
    }
    if (arg.prototype.key === 'GetDaysForActivityDaysPeriodQry') {
      return {
        isLoading: false,
        executeUseCase: jest.fn().mockResolvedValue(0)
      }
    }
  })

  render(
    <MemoryRouter>
      <ActivitiesPage />
    </MemoryRouter>
  )
}
