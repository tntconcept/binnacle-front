import { Project } from '../../../../shared/project/domain/project'

export type LiteProject = Pick<Project, 'id' | 'name' | 'projectBillingType'>
