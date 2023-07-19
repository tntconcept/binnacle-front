import { parseISO } from '../../../../../shared/utils/chrono'
import { ActivityWithProjectRoleId } from '../domain/activity-with-project-role-id'
import { ActivityWithProjectRoleIdDto } from './activity-with-project-role-id-dto'

export class ActivityWithProjectRoleIdMapper {
  static toDomain(dto: ActivityWithProjectRoleIdDto): ActivityWithProjectRoleId {
    return {
      ...dto,
      // TODO: Remove when back is implemented
      approval: {
        // @ts-ignore
        state: dto.approvalState,
        approvalDate: new Date(),
        approvedByUserName: 'John Doe'
      },
      interval: {
        start: parseISO(dto.interval.start),
        end: parseISO(dto.interval.end),
        duration: dto.interval.duration,
        timeUnit: dto.interval.timeUnit
      }
    }
  }
}
