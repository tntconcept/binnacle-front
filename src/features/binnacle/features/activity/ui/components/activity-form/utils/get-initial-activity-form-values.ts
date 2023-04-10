import { Activity } from 'features/binnacle/features/activity/domain/activity'
import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import chrono from 'shared/utils/chrono'
import { ActivityFormSchema } from '../activity-form.schema'
import { GetAutofillHours } from './get-autofill-hours'

export class GetInitialActivityFormValues {
  constructor(
    private activity: Activity | undefined,
    private recentRoles: ProjectRole[],
    private getAutofillHours: GetAutofillHours
  ) {}

  getInitialFormValues = () => {
    if (this.activity === undefined) {
      return this.getCreateActivityValues()
    } else {
      return this.getUpdateActivityValues()
    }
  }

  private getCreateActivityValues(): Partial<ActivityFormSchema> {
    const recentRole = this.recentRoles.at(0)
    const autoFillHours = this.getAutofillHours.getAutoFillHours()

    return {
      start: autoFillHours.startTime,
      end: autoFillHours.endTime,
      description: '',
      billable: recentRole?.project.billable ?? true,
      projectRole: recentRole
        ? { id: recentRole.id, name: recentRole.name, projectId: recentRole.project.id }
        : undefined
    }
  }

  private getUpdateActivityValues(): Partial<ActivityFormSchema> {
    const recentRole = this.recentRoles.find((r) => r.id === this.activity?.projectRole.id)

    return {
      start: chrono(this.activity!.interval.start).format(chrono.TIME_FORMAT),
      end: chrono(this.activity!.interval.start)
        .plus(this.activity!.interval.duration, 'minute')
        .format(chrono.TIME_FORMAT),
      description: this.activity!.description,
      billable: this.activity!.billable,
      projectRole: recentRole
        ? { id: recentRole.id, name: recentRole.name, projectId: recentRole.project.id }
        : undefined
    }
  }
}
