import { parseISO } from '../../../../../../shared/utils/chrono'
import { ProjectDto } from '../project-dto'
import { Project } from '../project'

export class ProjectMother {
  static tableProjectsList() {
    return [
      {
        organization: 'Organización Real',
        project: 'Proyecto A',
        startDate: '25/12/2020',
        open: true,
        billable: true,
        blockDate: '07/02/2023',
        action: { id: 1 }
      },
      {
        organization: 'Organización Real',
        project: 'Proyecto B',
        startDate: '01/01/2022',
        open: false,
        billable: false,
        blockDate: '-',
        action: { id: 2 }
      }
    ]
  }

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
        blockDate: '2023-04-01',
        blockedByUser: 1,
        organizationId: 1
      },
      {
        id: 3,
        name: 'Proyecto C',
        open: true,
        billable: true,
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
        blockDate: parseISO('2023-04-01'),
        blockedByUser: 1,
        organizationId: 1
      },
      {
        id: 3,
        name: 'Proyecto C',
        open: true,
        billable: true,
        startDate: parseISO('2023-03-01'),
        blockDate: null,
        blockedByUser: null,
        organizationId: 1
      }
    ]
  }
}
