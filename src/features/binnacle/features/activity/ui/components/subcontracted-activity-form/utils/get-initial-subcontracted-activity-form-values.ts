import { ProjectRole } from '../../../../../project-role/domain/project-role'
import { chrono } from '../../../../../../../../shared/utils/chrono'
import { SubcontractedActivityFormSchema } from '../subcontracted-activity-form.schema'
import { SubcontractedActivity } from '../../../../domain/subcontracted-activity'

export class GetInitialSubcontractedActivityFormValues {
  constructor(
    private subcontractedActivity: SubcontractedActivity | undefined,
    private recentRoles: ProjectRole[],
    private activityDate: Date
  ) {}

  getInitialFormValues = () => {
    if (this.subcontractedActivity === undefined) {
      return this.getCreateSubcontractedActivityValues()
    } else {
      return this.getUpdateSubcontractedActivityValues()
    }
  }

  private getCreateSubcontractedActivityValues(): Partial<SubcontractedActivityFormSchema> {
    const recentRole = this.recentRoles.at(0)
    const startDate = chrono(this.activityDate).getDate()

    return {
      startDate: chrono(startDate).format(chrono.DATE_FORMAT),
      endDate: chrono(startDate).format(chrono.DATE_FORMAT),
      description: '',
      billable: recentRole?.project.billable ?? false,
      recentProjectRole: recentRole,
      showRecentRole: true
    }
  }

  private getUpdateSubcontractedActivityValues(): Partial<SubcontractedActivityFormSchema> {
    const recentRole = this.recentRoles.find(
      (r) => r.id === this.subcontractedActivity?.projectRole.id
    )

    return {
      startDate: chrono(this.subcontractedActivity!.interval.start).format(chrono.DATE_FORMAT),
      endDate: chrono(this.subcontractedActivity!.interval.end).format(chrono.DATE_FORMAT),
      description: this.subcontractedActivity!.description,
      userId: this.subcontractedActivity!.userId,
      billable: this.subcontractedActivity!.billable,
      showRecentRole: recentRole !== undefined,
      organization: this.subcontractedActivity?.organization,
      //@ts-ignore
      project: this.subcontractedActivity?.project,
      //@ts-ignore
      projectRole: this.subcontractedActivity?.projectRole,
      recentProjectRole: recentRole
    }
  }
}
