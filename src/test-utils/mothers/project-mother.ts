import { Project } from '../../features/shared/project/domain/project'
import { parseISO } from '../../shared/utils/chrono'
import { ProjectDto } from '../../features/shared/project/domain/project-dto'
import { ProjectTypeMother } from './project-type-mother'

export class ProjectMother {
  static billableProject(): Project {
    return {
      id: 2,
      name: 'Billable project',
      open: true,
      startDate: parseISO('2023-01-01'),
      blockDate: parseISO('2023-06-01'),
      blockedByUser: null,
      organizationId: 1,
      projectBillingType: ProjectTypeMother.closedPriceProjectType()
    }
  }

  static notBillableProject(): Project {
    return {
      id: 1,
      name: 'No billable project',
      open: true,
      startDate: parseISO('2023-01-01'),
      blockDate: parseISO('2023-06-01'),
      blockedByUser: null,
      organizationId: 1,
      projectBillingType: ProjectTypeMother.noBillableProjectType()
    }
  }

  static projectsFilteredByOrganization(): ProjectDto[] {
    return [
      {
        id: 1,
        name: 'Proyecto A',
        open: true,
        startDate: '2023-01-01',
        blockDate: '2023-06-01',
        blockedByUser: 2,
        organizationId: 1,
        projectBillingType: ProjectTypeMother.timeAndMaterialsProjectType()
      },
      {
        id: 2,
        name: 'Proyecto B',
        open: true,
        startDate: '2023-03-01',
        blockDate: null,
        blockedByUser: 1,
        organizationId: 1,
        projectBillingType: ProjectTypeMother.timeAndMaterialsProjectType()
      },
      {
        id: 3,
        name: 'Proyecto C',
        open: false,
        startDate: '2023-03-01',
        blockDate: null,
        blockedByUser: null,
        organizationId: 1,
        projectBillingType: ProjectTypeMother.timeAndMaterialsProjectType()
      }
    ]
  }

  static projectsFilteredByOrganizationDateIso(): Project[] {
    return [
      {
        id: 1,
        name: 'Proyecto A',
        open: true,
        startDate: parseISO('2023-01-01'),
        blockDate: parseISO('2023-06-01'),
        blockedByUser: 2,
        organizationId: 1,
        projectBillingType: ProjectTypeMother.timeAndMaterialsProjectType()
      },
      {
        id: 2,
        name: 'Proyecto B',
        open: true,
        startDate: parseISO('2023-03-01'),
        blockDate: null,
        blockedByUser: 1,
        organizationId: 1,
        projectBillingType: ProjectTypeMother.timeAndMaterialsProjectType()
      },
      {
        id: 3,
        name: 'Proyecto C',
        open: false,
        startDate: parseISO('2023-03-01'),
        blockDate: null,
        blockedByUser: null,
        organizationId: 1,
        projectBillingType: ProjectTypeMother.timeAndMaterialsProjectType()
      }
    ]
  }

  static projectsFilteredByOrganizationDateIsoWithName(): Project[] {
    return [
      {
        id: 1,
        name: 'Proyecto A',
        open: true,
        startDate: parseISO('2023-01-01'),
        blockDate: parseISO('2023-06-01'),
        blockedByUser: 2,
        organizationId: 1,
        blockedByUserName: 'John Doe',
        projectBillingType: ProjectTypeMother.timeAndMaterialsProjectType()
      },
      {
        id: 2,
        name: 'Proyecto B',
        open: true,
        startDate: parseISO('2023-03-01'),
        blockDate: null,
        blockedByUser: 1,
        organizationId: 1,
        blockedByUserName: 'Lorem ipsum',
        projectBillingType: ProjectTypeMother.timeAndMaterialsProjectType()
      },
      {
        id: 3,
        name: 'Proyecto C',
        open: false,
        startDate: parseISO('2023-03-01'),
        blockDate: null,
        blockedByUser: null,
        organizationId: 1,
        projectBillingType: ProjectTypeMother.timeAndMaterialsProjectType()
      }
    ]
  }
}
