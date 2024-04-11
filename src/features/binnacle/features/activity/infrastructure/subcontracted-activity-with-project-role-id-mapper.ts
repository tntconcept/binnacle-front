import { parseISO } from '../../../../../shared/utils/chrono'
import { SubcontractedActivityWithProjectRoleId } from '../domain/subcontracted-activity-with-project-role-id'
import { SubcontractedActivityWithProjectRoleIdDto } from './subcontracted-activity-with-project-role-id-dto'

export class SubcontractedActivityWithProjectRoleIdMapper {
  static toDomain(
    dto: SubcontractedActivityWithProjectRoleIdDto
  ): SubcontractedActivityWithProjectRoleId {
    return {
      ...dto,
      interval: {
        start: parseISO(dto.interval.start),
        end: parseISO(dto.interval.end),
        duration: dto.interval.duration,
        timeUnit: dto.interval.timeUnit
      }
    }
  }
}

/* import { parseISO } from '../../../../../shared/utils/chrono'
import { ActivityWithProjectRoleId } from '../domain/activity-with-project-role-id'
import { ActivityWithProjectRoleIdDto } from './activity-with-project-role-id-dto'

export class ActivityWithProjectRoleIdMapper {
  static toDomain(dto: ActivityWithProjectRoleIdDto): ActivityWithProjectRoleId {
    return {
      ...dto,
      interval: {
        start: parseISO(dto.interval.start),
        end: parseISO(dto.interval.end),
        duration: dto.interval.duration,
        timeUnit: dto.interval.timeUnit
      }
    }
  }
} */
