import { parseISO } from '../../../../../../shared/utils/chrono'
import { ProjectDto } from '../project-dto'
import { Project } from '../project'

export class ProjectMother {
  static projectsFilteredByOrganization(): ProjectDto[] {
    return [
      {
        id: 1,
        name: 'Proyecto A',
        open: true,
        billable: true,
        startDate: '2023-01-01',
        blockDate: '2023-06-01',
        blockedByUser: 2,
        organizationId: 1
      },
      {
        id: 2,
        name: 'Proyecto B',
        open: true,
        billable: true,
        startDate: '2023-03-01',
        blockDate: null,
        blockedByUser: 1,
        organizationId: 1
      },
      {
        id: 3,
        name: 'Proyecto C',
        open: false,
        billable: false,
        startDate: '2023-03-01',
        blockDate: null,
        blockedByUser: null,
        organizationId: 1
      }
    ]
  }

  static projectsFilteredByOrganizationDateIso(): Project[] {
    return [
      {
        id: 1,
        name: 'Proyecto A',
        open: true,
        billable: true,
        startDate: parseISO('2023-01-01'),
        blockDate: parseISO('2023-06-01'),
        blockedByUser: 2,
        organizationId: 1
      },
      {
        id: 2,
        name: 'Proyecto B',
        open: true,
        billable: true,
        startDate: parseISO('2023-03-01'),
        blockDate: null,
        blockedByUser: 1,
        organizationId: 1
      },
      {
        id: 3,
        name: 'Proyecto C',
        open: false,
        billable: false,
        startDate: parseISO('2023-03-01'),
        blockDate: null,
        blockedByUser: null,
        organizationId: 1
      }
    ]
  }

  static projectsFilteredByOrganizationDateIsoWithName(): Project[] {
    return [
      {
        id: 1,
        name: 'Proyecto A',
        open: true,
        billable: true,
        startDate: parseISO('2023-01-01'),
        blockDate: parseISO('2023-06-01'),
        blockedByUser: 2,
        organizationId: 1,
        blockedByUserName: 'John Doe'
      },
      {
        id: 2,
        name: 'Proyecto B',
        open: true,
        billable: true,
        startDate: parseISO('2023-03-01'),
        blockDate: null,
        blockedByUser: 1,
        organizationId: 1,
        blockedByUserName: 'Lorem ipsum'
      },
      {
        id: 3,
        name: 'Proyecto C',
        open: false,
        billable: false,
        startDate: parseISO('2023-03-01'),
        blockDate: null,
        blockedByUser: null,
        organizationId: 1
      }
    ]
  }
}
