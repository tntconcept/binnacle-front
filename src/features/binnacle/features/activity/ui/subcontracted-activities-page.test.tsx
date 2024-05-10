import { useExecuteUseCaseOnMount } from '../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from '../../../../../shared/arch/hooks/use-get-use-case'
import { render, screen } from '../../../../../test-utils/render'
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

    expect((await screen.findAllByText('actions.edit')).length).toBeGreaterThanOrEqual(2)
    expect((await screen.findAllByText('actions.remove')).length).toBeGreaterThanOrEqual(2)
  })

  it('should render correctly empty table', async () => {
    setup([])
    expect(await screen.findByText('subcontracted_activity.empty')).toBeInTheDocument()
  })
})

function setup(subcontractedActivities: SubcontractedActivity[]) {
  const recentRoles = ProjectRoleMother.projectRoles()
  const settings = UserSettingsMother.userSettings()
  const deleteSubcontractedActivityCmdMock = jest.fn()
  const createSubcontractedActivityCmdMock = jest.fn()
  const updateSubcontractedActivityCmdMock = jest.fn()

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
        useCase: deleteSubcontractedActivityCmdMock
      }
    }
    if (arg.prototype.key === 'CreateSubcontractedActivityCmd') {
      return {
        useCase: createSubcontractedActivityCmdMock
      }
    }
    if (arg.prototype.key === 'UpdateSubcontractedActivityCmd') {
      return {
        useCase: updateSubcontractedActivityCmdMock
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
