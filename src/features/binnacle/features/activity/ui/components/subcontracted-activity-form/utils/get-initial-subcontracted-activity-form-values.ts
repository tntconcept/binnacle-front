import { SubcontractedActivityFormSchema } from '../subcontracted-activity-form.schema'
import { SubcontractedActivity } from '../../../../domain/subcontracted-activity'

export class GetInitialSubcontractedActivityFormValues {
  constructor(private subcontractedActivity: SubcontractedActivity | undefined) {}

  getInitialFormValues = () => {
    if (this.subcontractedActivity === undefined) {
      return this.getCreateSubcontractedActivityValues()
    } else {
      return this.getUpdateSubcontractedActivityValues()
    }
  }

  private getCreateSubcontractedActivityValues(): Partial<SubcontractedActivityFormSchema> {
    return {
      description: '',
      billable: false
    }
  }

  private getUpdateSubcontractedActivityValues(): Partial<SubcontractedActivityFormSchema> {
    const subcontractedActivity = this.subcontractedActivity!
    const durationInHours = subcontractedActivity.duration

    return {
      description: this.subcontractedActivity!.description,
      userId: this.subcontractedActivity!.userId,
      billable: this.subcontractedActivity!.billable,
      organization: this.subcontractedActivity?.organization,
      //TODO remove test ignore
      //@ts-ignore
      project: this.subcontractedActivity?.project,
      //@ts-ignore
      projectRole: this.subcontractedActivity?.projectRole,
      month: this.subcontractedActivity?.month,
      duration: durationInHours
    }
  }
}
