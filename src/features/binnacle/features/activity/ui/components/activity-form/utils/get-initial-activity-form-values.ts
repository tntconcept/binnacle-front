import { Activity } from 'features/binnacle/features/activity/domain/activity'
import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import chrono from 'shared/utils/chrono'
import { ActivityFormSchema } from '../activity-form.schema'
import { GetAutofillHours } from './get-autofill-hours'

export class GetInitialActivityFormValues {
  constructor(
    private activity: Activity | undefined,
    private recentRoles: ProjectRole[],
    private getAutofillHours: GetAutofillHours,
    private activityDate: Date
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
    const startDate = chrono(this.activityDate).getDate()

    return {
      startTime: autoFillHours.startTime,
      endTime: autoFillHours.endTime,
      startDate: chrono(startDate).format(chrono.DATE_FORMAT),
      endDate: chrono(startDate).format(chrono.DATE_FORMAT),
      description: '',
      billable: recentRole?.project.billable ?? false,
      recentProjectRole: recentRole,
      showRecentRole: true
    }
  }

  private getUpdateActivityValues(): Partial<ActivityFormSchema> {
    const recentRole = this.recentRoles.find((r) => r.id === this.activity?.projectRole.id)

    return {
      startTime: chrono(this.activity!.interval.start).format(chrono.TIME_FORMAT),
      endTime: chrono(this.activity!.interval.end).format(chrono.TIME_FORMAT),
      startDate: chrono(this.activity!.interval.start).format(chrono.DATE_FORMAT),
      endDate: chrono(this.activity!.interval.end).format(chrono.DATE_FORMAT),
      description: this.activity!.description,
      billable: this.activity!.billable,
      showRecentRole: recentRole !== undefined,
      organization: this.activity?.organization,
      //@ts-ignore
      project: this.activity?.project,
      //@ts-ignore
      projectRole: this.activity?.projectRole,
      recentProjectRole: recentRole
    }
  }
}
