import { ProjectBillableType } from './project-billable-type'

export interface ProjectBillingType {
  billableByDefault: boolean
  name: string
  type: ProjectBillableType
}
