import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { act, render, screen, userEvent } from '../../../../../test-utils/render'
import { SubcontractedActivityMother } from '../../../../../test-utils/mothers/subcontracted-activity-mother'
import { ProjectRoleMother } from '../../../../../test-utils/mothers/project-role-mother'
import { UserSettingsMother } from '../../../../../test-utils/mothers/user-settings-mother'
import { SubcontractedActivity } from '../domain/subcontracted-activity'
import SubcontractedActivitiesPage from './subcontracted-activities-page'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../../../../../shared/arch/hooks/use-execute-use-case-on-mount')
jest.mock('../../../../../shared/arch/hooks/use-get-use-case')

describe('SubcontractedActivitiesPage', () => {
  it('should render correctly the subcontracted activities', async () => {
    const subcontractedActivities = SubcontractedActivityMother.subcontractedActivities()
    setup(subcontractedActivities)

    expect(await screen.findByText('actions.edit')).toBeInTheDocument()
    expect(await screen.findByText('actions.remove')).toBeInTheDocument()
  })

  it('should render correctly empty table', async () => {
    setup([])
    expect(await screen.findByText('activity.empty')).toBeInTheDocument()
  })

  it('should open new subcontracted activity modal', async () => {
    setup([])
    userEvent.click(screen.getByTestId('show_activity_modal'))
    expect(await screen.findByText('subcontracted_activity_form.description')).toBeInTheDocument()
  })

  it('should open edit subcontracted activity modal', async () => {
    const subcontractedActivities = SubcontractedActivityMother.subcontractedActivities()
    setup(subcontractedActivities)
    act(() => {
      userEvent.click(screen.getByText('actions.edit'))
    })
    expect(await screen.findByText('subcontracted_activity_form.description'))
  })

  it('should open delete modal', async () => {
    const subcontractedActivities = SubcontractedActivityMother.subcontractedActivities()
    setup(subcontractedActivities)
    act(() => {
      userEvent.click(screen.getByText('actions.remove'))
    })
    expect(await screen.findByText('activity_form.remove_activity')).toBeInTheDocument()
  })
})

function setup(subcontractedActivities: SubcontractedActivity[]) {
  const recentRoles = ProjectRoleMother.projectRoles()
  const settings = UserSettingsMother.userSettings()
  const deleteActivityCmdMock = jest.fn()
  const createActivityCmdMock = jest.fn()
  const updateActivityCmdMock = jest.fn()

  ;(useExecuteUseCaseOnMount as jest.Mock).mockImplementation((arg) => {
    if (arg.prototype.key === 'GetSubcontractedActivitiesQry') {
      return {
        isLoading: false,
        result: subcontractedActivities,
        executeUseCase: jest.fn().mockResolvedValue(subcontractedActivities)
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
    if (arg.prototype.key === 'DeleteSubcontractedActivityCmd') {
      return {
        useCase: deleteActivityCmdMock
      }
    }
    if (arg.prototype.key === 'CreateSubcontractedActivityCmd') {
      return {
        useCase: createActivityCmdMock
      }
    }
    if (arg.prototype.key === 'UpdateSubcontractedActivityCmd') {
      return {
        useCase: updateActivityCmdMock
      }
    }
    if (arg.prototype.key === 'GetProjectsQry') {
      return { isLoading: false }
    }
    if (arg.prototype.key === 'GetProjectRolesQry') {
      return { isLoading: false, executeUseCase: jest.fn().mockResolvedValue([]) }
    }
  })

  render(
    <MemoryRouter>
      <SubcontractedActivitiesPage />
    </MemoryRouter>
  )
}
