import userEvent from '@testing-library/user-event'
import { OrganizationRepository } from '../../../../../binnacle/features/organization/domain/organization-repository'
import { UserRepository } from '../../../../../shared/user/domain/user-repository'
import {
  ADMINISTRATION_PROJECT_REPOSITORY,
  ORGANIZATION_REPOSITORY,
  USER_REPOSITORY
} from '../../../../../../shared/di/container-tokens'
import { OrganizationMother } from '../../../../../../test-utils/mothers/organization-mother'
import { UserMother } from '../../../../../../test-utils/mothers/user-mother'
import { container } from 'tsyringe'
import { ProjectRepository } from '../../domain/project-repository'
import { ProjectMother } from '../../domain/tests/project-mother'
import { ProjectsTable } from './projects-table'
import { render, screen, waitFor, act } from '../../../../../../test-utils/render'

describe('ProjectsTable', () => {
  it('should show all projects when organization filter is changed', async () => {
    setup()
    const projects = ProjectMother.projectsFilteredByOrganizationDateIsoWithName()

    await act(async () => {
      const organizationCombo = screen.getByTestId('organization_field')
      await userEvent.type(organizationCombo, OrganizationMother.organization().name)
    })

    await waitFor(() => {
      projects.map((p) => {
        expect(screen.getByText(p.name)).toBeInTheDocument()
      })
    })
  })

  it('should execute onProjectClicked method when project block action is pressed', async () => {
    const { onProjectClicked } = setup()

    await act(async () => {
      const organizationCombo = screen.getByTestId('organization_field')
      await userEvent.type(organizationCombo, OrganizationMother.organization().name)
    })

    await act(async () => {
      const blockButtons = screen.getAllByRole('button')
      await userEvent.click(blockButtons[0])
    })
    expect(onProjectClicked).toBeCalledTimes(1)
  })
})

function setup() {
  const projectRepository = container.resolve<jest.Mocked<ProjectRepository>>(
    ADMINISTRATION_PROJECT_REPOSITORY
  )
  const userRepository = container.resolve<jest.Mocked<UserRepository>>(USER_REPOSITORY)
  const organizationRepository =
    container.resolve<jest.Mocked<OrganizationRepository>>(ORGANIZATION_REPOSITORY)
  organizationRepository.getAll.mockResolvedValue(OrganizationMother.organizations())

  projectRepository.getProjects.mockResolvedValue(
    ProjectMother.projectsFilteredByOrganizationDateIsoWithName()
  )
  userRepository.getUsers.mockResolvedValue(UserMother.userList())

  const onProjectClicked = jest.fn()

  render(<ProjectsTable onProjectClicked={onProjectClicked} />)

  return {
    projectRepository,
    userRepository,
    organizationRepository,
    onProjectClicked
  }
}
