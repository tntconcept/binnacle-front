import { chrono } from '../../../../../shared/utils/chrono'
import { Project } from '../../../../shared/project/domain/project'
import { ProjectBillingType } from '../../../../shared/project/domain/project-billing-type'

export interface AdaptedProjects {
  key: number
  organization: string
  project: string
  startDate: string
  open: boolean
  projectBillingType: ProjectBillingType
  blockDate: string
  action: Project
}

export const adaptProjectsToTable = (
  organization: string,
  projects: Project[]
): AdaptedProjects[] => {
  return projects?.map((project, key) => {
    return {
      key,
      organization: organization,
      project: project.name,
      startDate: project.startDate ? chrono(project.startDate).format('dd/MM/yyyy') : '-',
      open: project.open,
      projectBillingType: project.projectBillingType,
      blockDate: project.blockDate ? chrono(project.blockDate).format('dd/MM/yyyy') : '-',
      action: project
    }
  })
}
