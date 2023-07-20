import { render, screen, waitFor } from '@testing-library/react'
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

describe('ProjectsTable', () => {
  const setup = () => {
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

    return {
      projectRepository,
      userRepository,
      organizationRepository,
      onProjectClicked
    }
  }
  it('should show filter required message when organization filter is empty', () => {
    const { onProjectClicked } = setup()

    render(<ProjectsTable onProjectClicked={onProjectClicked} />)

    const filterRequiredMessage = screen.getByText('projects.filter_required')
    expect(filterRequiredMessage).toBeInTheDocument()
  })

  it('should show all projects when organization filter is changed', async () => {
    const { onProjectClicked } = setup()
    const projects = ProjectMother.projectsFilteredByOrganizationDateIsoWithName()

    render(<ProjectsTable onProjectClicked={onProjectClicked} />)

    await waitFor(() => {
      const organizationCombo = screen.getByTestId('organization_field')
      userEvent.type(organizationCombo, OrganizationMother.organization().name)
    })

    projects.map((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument()
    })
  })

  it('should execute onProjectClicked method when project block action is pressed', async () => {
    const { onProjectClicked } = setup()

    render(<ProjectsTable onProjectClicked={onProjectClicked} />)

    await waitFor(() => {
      const organizationCombo = screen.getByTestId('organization_field')
      userEvent.type(organizationCombo, OrganizationMother.organization().name)
    })

    const blockButtons = screen.getAllByRole('button')
    userEvent.click(blockButtons[0])
    expect(onProjectClicked).toBeCalledTimes(1)
  })
})
