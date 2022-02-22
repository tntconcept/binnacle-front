import { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import chrono from 'shared/utils/chrono'
import { GetRecentRole } from 'modules/binnacle/components/ActivityForm/utils/get-recent-role'
import { GetAutofillHours } from 'modules/binnacle/components/ActivityForm/utils/get-autofill-hours'

export class GetInitialActivityFormValues {
  constructor(
    private activity: Activity | undefined,
    private getRecentRole: GetRecentRole,
    private getAutofillHours: GetAutofillHours
  ) {}

  getInitialFormValues = () => {
    if (this.activity === undefined) {
      return this.getCreateActivityValues()
    } else {
      return this.getUpdateActivityValues()
    }
  }

  private getCreateActivityValues() {
    const recentRole = this.getRecentRole.getRole()
    const autoFillHours = this.getAutofillHours.getAutoFillHours()
    return {
      startTime: autoFillHours.startTime,
      endTime: autoFillHours.endTime,
      description: '',
      billable: recentRole?.projectBillable ?? false,
      organization: undefined,
      project: undefined,
      role: undefined,
      showRecentRole: recentRole !== undefined,
      recentRole: recentRole,
      imageBase64: null
    }
  }

  private getUpdateActivityValues() {
    const recentRole = this.getRecentRole.getRole()
    const showRecentRole = this.activity?.project.id === recentRole?.id

    return {
      startTime: chrono(this.activity!.startDate).format(chrono.TIME_FORMAT),
      endTime: chrono(this.activity!.startDate)
        .plus(this.activity!.duration, 'minute')
        .format(chrono.TIME_FORMAT),
      description: this.activity!.description,
      billable: this.activity!.billable,
      organization: this.activity!.organization,
      project: this.activity!.project,
      role: this.activity!.projectRole,
      showRecentRole: showRecentRole,
      recentRole: recentRole,
      imageBase64: null
    }
  }
}
