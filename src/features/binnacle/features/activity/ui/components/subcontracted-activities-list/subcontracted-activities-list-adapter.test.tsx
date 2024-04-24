import { SubcontractedActivityMother } from '../../../../../../../test-utils/mothers/subcontracted-activity-mother'
import { subcontractedActivitiesListAdapter } from './subcontracted-activities-list-adapter'
import { AdaptedSubcontractedActivity } from './types/adapted-subcontracted-activity'

describe('SubcontractedActivitiesListAdapter', () => {
  it('should return an empty adaptive activity', () => {
    const result = subcontractedActivitiesListAdapter([])

    expect(result).toEqual([])
  })

  it('should return an adapted activity when activity list has only one activity', () => {
    const subcontractedActivity = SubcontractedActivityMother.activity()
    const { organization, project, projectRole } = subcontractedActivity
    const expected: AdaptedSubcontractedActivity = {
      ...subcontractedActivity,
      key: subcontractedActivity.id,
      duration: subcontractedActivity.duration / 60,
      organization: organization.name,
      project: project.name,
      role: projectRole.name,
      action: subcontractedActivity
    }

    const result = subcontractedActivitiesListAdapter([subcontractedActivity])

    expect([expected]).toEqual(result)
  })
})
