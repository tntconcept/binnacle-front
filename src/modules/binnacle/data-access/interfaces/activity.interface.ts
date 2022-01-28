import type { Organization } from 'modules/binnacle/data-access/interfaces/organization.interface'
import type { ProjectRole } from 'modules/binnacle/data-access/interfaces/project-role.interface'
import type { Project } from 'modules/binnacle/data-access/interfaces/project.interface'

export interface Activity {
  id: number
  startDate: Date
  duration: number
  description: string
  userId: number
  billable: boolean
  hasImage: boolean
  imageFile?: string
  organization: Organization
  project: Project
  projectRole: ProjectRole
}
