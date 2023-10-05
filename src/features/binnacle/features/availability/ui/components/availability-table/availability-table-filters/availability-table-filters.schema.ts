import { UserInfo } from '../../../../../../../shared/user/domain/user-info'
import { Project } from '../../../../../../../shared/project/domain/project'
import { Organization } from '../../../../../organization/domain/organization'

export interface AvailabilityTableFiltersSchema {
  organization?: Organization
  project?: Project
  user?: UserInfo
}
