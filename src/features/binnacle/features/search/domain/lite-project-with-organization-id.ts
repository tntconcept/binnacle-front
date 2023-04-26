import { Id } from 'shared/types/id'
import { LiteProject } from '../../project/domain/lite-project'

export type LiteProjectWithOrganizationId = LiteProject & {
  organizationId: Id
}
