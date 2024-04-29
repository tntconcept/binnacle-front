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
      description: ''
    }
  }

  private getUpdateSubcontractedActivityValues(): Partial<SubcontractedActivityFormSchema> {
    const subcontractedActivity = this.subcontractedActivity!
    const durationInHours = subcontractedActivity.duration

    return {
      description: this.subcontractedActivity!.description,
      userId: this.subcontractedActivity!.userId,
      organization: this.subcontractedActivity?.organization,
      //@ts-ignore
      project: this.subcontractedActivity?.project,
      //@ts-ignore
      projectRole: this.subcontractedActivity?.projectRole,
      month: this.subcontractedActivity?.month,
      duration: durationInHours
    }
  }
}
